import { getData,execute,getPageData } from './common'
import { httpGet } from "../net"; 
import { getUser } from './user';



 
//所有发文
export async function messagePageData({ps,pi,w,v})
{
    let where='send_type=0'; 
    if(w==1) where="_type=1"  //活动发文
    else if(w==2) where=`dao_id=${v} and send_type=0` //智能公器
    else if(w==3) where=`id in(select pid from a_bookmark where cid=${v})`  //我的收藏
    else if(w==4) where=`actor_account='${v}' or receive_account='${v}'`  //我的发布
    let re= await getPageData('messageview',ps,pi,'id','desc',where);
    return re 
}

//关注插入
export async function insertMessage(id,account,linkUrl)
{
	let re=await getData("SELECT message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,top_img,dao_id,start_time,end_time,event_url,event_address,time_event,_type,actor_inbox FROM a_message where id=?"
	,[id]);

	// if(re[0]) return
	re=re[0]
	let sql="insert into a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,top_img,dao_id,start_time,end_time,event_url,event_address,time_event,_type,receive_account,actor_inbox,is_send,is_discussion,send_type,link_url) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	let paras=[re.message_id,re.manager,re.actor_name,re.avatar,re.actor_account,re.actor_url,re.title,re.content,re.top_img,re.dao_id
	,re.start_time,re.end_time,re.event_url,re.event_address,re.time_event,re._type,account,re.actor_inbox,0,0,1,linkUrl]

	await execute(sql,paras)
}
 
//所有回复
export async function replyPageData({ps,pi,pid})
{
    let re= await getPageData('replyview',ps,pi,'id','desc',`pid=${pid}`);
    return re 
}

//删除
export async function messageDel({id,type})
{
    if(type=='0') return await execute('delete from a_message where id=?',[id]);
    else return await execute('delete from a_message_commont where id=?',[id]);
}

//获取所有已注册的dao
export async function getAllSmartCommon()
{
    let re= await getData('select * from v_allsmartcommon',[]);
    return re || []
}


//获取点赞数量及是否已点赞heart  获取收藏数量及是否已收藏bookmark  cid:人id pid:发文id
export async function getHeartAndBook({pid,cid,table})
{
    let sql=`SELECT a.total,IFNULL(b.pid,0) pid FROM (SELECT COUNT(*) total FROM a_${table} WHERE pid=?) a LEFT JOIN (SELECT pid FROM a_${table} WHERE pid=? and cid=?) b ON 1=1`
    let re= await getData(sql,[pid,pid,cid]);
    return re || []
}


//点赞、取消点赞 heart  收藏、取消收藏 bookmark  cid:人id pid:发文id
export async function handleHeartAndBook({cid,pid,flag,table})
{
    if(flag==0)  return await execute(`delete from a_${table} where pid=? and cid=?`,[pid,cid]);
    else return await execute(`insert into a_${table}(cid,pid) values(?,?)`,[cid,pid]);
}


//获取一条发文
export async function getOne(id)
{
    let re= await getData('select * from v_message where id=?',[id]);
    return  re[0] || {}
}

//查找我关注过的人
async function findFollow(actor_account,user_account){
	let sql="select id from a_follow where actor_account=? and user_account=?";
	let re=await getData(sql,[actor_account,user_account])
	if(re && re.length>0 ) return re[0].id; //找到
	else return 0;
}

//actor_account 查找的帐号 user_account 本地帐号
export async function fromAccount({actor_account,user_account}){
	let obj={};
	if(actor_account.includes(process.env.LOCAL_DOMAIN)){ //本地帐号
		// {name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
		let sql='SELECT actor_name `name`, actor_inbox inbox,domain,actor_account account,actor_url url,avatar,pubkey FROM v_account where actor_account=? || actor_url=?';
		let re=await getData(sql,[actor_account,actor_account]);
		if(re[0]){
			obj=re[0]
			obj['id']=await findFollow(actor_account,user_account)
		} 
	} else { //非本地， 需要从远程服务器下载
		if(actor_account.startsWith('http')) obj=await getInboxFromUrl(actor_account);
		else obj=await getInboxFromAccount(actor_account);
	
		if(obj.inbox){ //找到帐号后是否已经关注
			obj['id']=await findFollow(actor_account,user_account)
		}

	}
	return obj;

}

export async function getInboxFromAccount(account) {
	//  account='gym@daotodon.me'
	let strs=account.split('@')
	let obj={name:strs[0],domain:strs[1],inbox:''}
	let re=await httpGet(`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
	// let re=await httpGet(`http://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
	if(re.code!==200) return obj;
	re=re.message;
	if(!re) return obj;
	let url,type;
	for(let i=0;i<re.links.length;i++)
	{
		if(re.links[i].rel==='self')
		{
			url=re.links[i].href;
			type=re.links[i].type
			break;
		}
	}
	// url='http://localhost:3000/api/activitepub/users/gym'
	let reobj=await getInboxFromUrl1(url,type);
	return reobj;
}

export async function getLocalInboxFromAccount(account) {
	let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let user=await getUser('actor_account',account,'actor_url,avatar,pubkey');
	if(!user['actor_url']) return obj;
	const [userName,domain]=account.split('@');

	return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`,account,url:user['actor_url'],pubkey:user['pubkey'],avatar:user['avatar']}
}

export async function getLocalInboxFromUrl(url){
	let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let user=await getUser('actor_url',url,'actor_account,avatar,pubkey');
	if( process.env.IS_DEBUGGER==='1') { console.info("user",user)	}
	if(!user['actor_account']) return obj;
	const [userName,domain]=user.actor_account.split('@');

	return {name:userName,domain,inbox:`https://${domain}/api/activitepub/inbox/${userName}`
	,account:user['actor_account'],url,pubkey:user['pubkey'],avatar:user['avatar']}
}

export async function getInboxFromUrl(url,type='application/activity+json'){
	const myURL = new URL(url);
	let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let re= await httpGet(url,{"Content-Type": type})
	if(re.code!==200) return obj;
	re=re.message
	if(!re) return obj;
	if(re.name) obj.name=re.name;
	if(re.inbox) { 
	obj.inbox=re.inbox; 
	obj.desc=re.summary;
	obj.pubkey=re.publicKey.publicKeyPem;
	obj.url=re.id;
	obj.account=`${re.name}@${myURL.hostname}`
	}
	if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
	else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

	return obj 
}


async function getInboxFromUrl1(url,type='application/activity+json'){
	const myURL = new URL(url);
	let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',avatar:''}
	let re= await httpGet(url,{"Content-Type": type})
	if(re.code!==200) return obj;
	re=re.message
	if(!re) return obj;
	if(re.name) obj.name=re.name;
	if(re.inbox) { 
	obj.inbox=re.inbox; 
	obj.desc=re.summary;
	obj.pubkey=re.publicKey.publicKeyPem;
	obj.url=re.id;
	obj.account=`${re.name}@${myURL.hostname}`
	}
	if(re.avatar && re.avatar.url) obj.avatar=re.avatar.url;   
	else if(re.icon && re.icon.url) obj.avatar=re.icon.url;  

	return obj 
}