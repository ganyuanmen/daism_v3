
import {saveFollow,removeFollow,getFollow} from '../../../../lib/mysql/folllow'
import {createAccept} from '../../../../lib/activity'
import { getUser } from "../../../../lib/mysql/user";
import {signAndSend,broadcast} from '../../../../lib/net'
import { getOne } from "../../../../lib/mysql/message";
import { execute,getData } from "../../../../lib/mysql/common";
import { getInboxFromUrl,getLocalInboxFromUrl } from '../../../../lib/mysql/message';


/**
 * 收件箱 接收其它activity 软件推送过来的信息
 * 只接收对方的关注， 不关注其他人
 */

export default async function handler(req, res) {

	if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
	let postbody
	try {
	if(typeof req.body==='string') postbody=JSON.parse(req.body)
	else postbody=req.body 
	} catch (error) {
	console.error("inbox error ",error,req.body)
	console.error(error)
	}
	if( process.env.IS_DEBUGGER==='1'  && postbody.type.toLowerCase()!=='delete') { 
	console.info("-----------inbox post infomation-----------------------------------------------")
	console.info(postbody)
	console.info("----------------------------------------------------------")
	}
	if(typeof(postbody)!=='object' || !postbody.type) return res.status(405).json({errMsg:'body json error'})

	const name = req.query.id;

	switch (postbody.type.toLowerCase()) {
		case 'accept': 
			accept(postbody,process.env.LOCAL_DOMAIN).then(()=>{});
			break;
		case 'reject':break;
		case 'undo':   //对方取消关注
			undo(postbody).then(()=>{});
			break;
		case 'block':break;
		case 'create': 
			createMess(postbody,name).then(()=>{}); 
			break;
		case 'delete': break;
		case 'like':break;
		case 'update':break;
		case 'add':break;
		case 'remove': break;
		case 'follow':  //关注
			follow(postbody,name,process.env.LOCAL_DOMAIN).then(()=>{});
		break;
	}
	res.status(200).json({msg: 'ok'});
	return;
}


async function createMess(postbody,name){ //对方的推送
	let replyType=postbody.object.inReplyTo || postbody.object.inReplyToAtomUri || null;  //inReplyTo:
	//inReplyTo: 'https://daism.io/communities/message/5',
	const  {content,title,actor,id,message_id,imgpath}=await genePost(postbody,replyType)

	if(!actor.account) return
	let strs=actor.account.split('@') 
	if(replyType){ //对方的回复
		if(id)
		{       
			let message=await getOne(id)
			if(message['is_discussion']===1) //允许讨论
			{
				execute("INSERT INTO a_message_commont(pid,message_id,actor_name,avatar,actor_account,actor_url,content) values(?,?,?,?,?,?,?)",
				[id,message_id,strs[0],actor.avatar,actor.account,postbody.actor,content]).then(()=>{})
			}
		}
	}
	else{  //对方推送
		let localUser=await getUser('actor_account',`${name}@${process.env.LOCAL_DOMAIN}`,'manager');
		if(!localUser.manager) return;
		let linkUrl=postbody.object.url || postbody.object.atomUri
		let sql="INSERT INTO a_message(manager,message_id,actor_name,avatar,actor_account,actor_url,content,actor_inbox,receive_account,is_send,is_discussion,link_url,title,top_img,send_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		let paras=[localUser.manager, message_id,strs[0],actor.avatar,actor.account,postbody.actor,content,actor.inbox,`${name}@${process.env.LOCAL_DOMAIN}`,0,0,linkUrl,title,imgpath,1]	
		execute(sql,paras).then(()=>{})
	}
	
}

async function genePost(postbody,replyType){
	let content=(postbody?.object?.content?new String(postbody.object.content).toString():' ')
	let title=(postbody?.object?.title?new String(postbody.object.title).toString():' ')
	let imgpath=(postbody?.object?.imgpath?new String(postbody.object.imgpath).toString():' ')

	//先从数据库中查找
	let actor=await getData('SELECT actor_account account,actor_url url,actor_avatar avatar,actor_inbox inbox FROM a_follow WHERE actor_url=?',[postbody.actor]);
	
	if(actor[0]) actor=actor[0]
	else  //数据库找不到，从网站上找
		actor= await getInboxFromUrl(postbody.actor)

	let message_id=postbody.id;
	let id=0
	if(!replyType || !replyType.includes('/communities/')) return {content,title,imgpath,actor,id,message_id} //不是本地回复，可能是推送或其它回复
	
	if(actor.account)
	{
		let ids=replyType.split('/')
		let _id=parseInt(ids[ids.length-1])
		if(_id && Number.isFinite(_id))  id=_id;
	}
	return {content,title,imgpath,actor,id,message_id}
}

async function undo(postbody){  //别人取消关注 
	if(!postbody.object || !postbody.object.id) return 'activity error!';
	await removeFollow(postbody.object.id)
	broadcast({type:'removeFollow',domain:process.env.LOCAL_DOMAIN,actor:{},user:{},followId:postbody.object.id})  //广播信息
	return 'undo handle ok'
}

async function accept(postbody,domain) //我关注他人的确认
{
	let actor=await getInboxFromUrl(postbody.actor); 
	if( process.env.IS_DEBUGGER==='1') console.info("accept actor",actor)
	let user=await getLocalInboxFromUrl(postbody.object.actor);
	if( process.env.IS_DEBUGGER==='1') console.info("accept user",actor)
	let re= await saveFollow({actor,user,followId:postbody.object.id})  //关注他人的确认
	broadcast({type:'follow',domain,user,actor,followId:postbody.object.id})  //广播信息
	return "accept handle ok"
}

async function follow(postbody,name,domain) //别人的关注
{
	let actor=await getInboxFromUrl(postbody.actor); //主动关注者
	if( process.env.IS_DEBUGGER==='1') { 
		console.info("follow get actor:-----------------------------------------------")
		console.info(actor)
	}
	let user=await getLocalInboxFromUrl(postbody.object) //被动关注者
	if( process.env.IS_DEBUGGER==='1') { 
		console.info("follow get user:-----------------------------------------------------")
		console.info(user)
	}
	if(!actor.inbox) return  `no found for ${postbody.actor}`;
	if(user.name.toLowerCase()!==name.toLowerCase() || user.domain.toLowerCase()!==domain.toLowerCase()) return 'activity error ';
	let thebody=createAccept(postbody,name,domain);
	let follow=await getFollow({actorAccount:user.account,userAccount:actor.account}); // 注：是actor 关注user
	let localUser=await getUser('actor_account',user.account,'privkey,dao_id')
	if(follow['follow_id']) { 
	console.info("已关注"); //已关注
	await removeFollow(follow['follow_id'])
	} 

	let lok=await saveFollow({actor:user,user:actor,followId:postbody.id});// 被他人关注 
	if(lok)
	{
		console.info("follow save is ok")
		broadcast({type:'follow',domain,actor:user,user:actor,followId:postbody.id})  //广播信息
		signAndSend(actor.inbox,name,domain,thebody,localUser.privkey);
		return 'follow handle ok!'
	}  
	else  return 'server handle error';

}
