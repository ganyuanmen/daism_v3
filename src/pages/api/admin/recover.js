import withSession from "../../../lib/session";
import { broadcast } from "../../../lib/net";
// const request = require('request')
import { execute } from "../../../lib/mysql/common";
import { httpGet } from "../../../lib/net";

function geneChar(_name) {
  if(_name) return _name;
  return null;
}

function insertData(data,actor_name,domain,avatar) {

   data.forEach(e => {
      let sql="INSERT INTO a_message(message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,video_url,dao_id,start_time,end_time,event_url,event_address,time_event,_type,receive_account,actor_inbox,send_type,link_url,createtime) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      let paras=[e.message_id,e.manager,actor_name,avatar,`${actor_name}@${domain}`,`https://${domain}/api/activitepub/users/${actor_name}`
        ,e.title,e.content,e.is_send,e.is_discussion,geneChar(e.top_img),geneChar(e.video_url),e.dao_id,geneChar(e.start_time),geneChar(e.end_time),geneChar(e.event_url),geneChar(e.event_address),geneChar(e.time_event),e._type,geneChar(e.receive_account)
        ,`https://${domain}/api/activitepub/inbox/${actor_name}`,e.send_type,geneChar(e.link_url),e.createtime];
      execute(sql,paras).then(()=>{});
      
    });
  }

export default withSession(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed'})
  }
  const {actorName,domain,oldAccount } = req.body;
  const newAccount=`${actorName}@${domain}`;


  const [name,oldDomain]=oldAccount.split('@');

  let sql="call recover_follow(?,?)";
  let paras=[newAccount,oldAccount];
  await execute(sql,paras);
  console.log('22222222')
  // 广播

  broadcast({type:'recover',domain,user:{account:newAccount},actor:{account:oldAccount},followId:'0'})  //广播信息
  console.log('33333333')
  
  let re1=await httpGet(`https://${oldDomain}/api/getUserMwssage?newAccount=${newAccount}&oldAccount=${oldAccount}`, {'content-type': 'application/activity+json'});
  console.log("re1",re1)
  let avatar=`https://${domain}/user.svg`;
  let actor_desc='';
  if(re1 && re1.code===200) {
    avatar=re1.message.avatar;
    actor_desc=re1.message.actor_desc;
  }

  if(domain!==oldDomain) {

   
      let sql="update a_account set avatar=?,actor_desc=? where actor_account=? or actor_account=?";
      let paras=[avatar,actor_desc,oldAccount,newAccount];
      await execute(sql,paras);
    

    let pi=1;
    while(true) {
      let re=await httpGet(`https://${oldDomain}/api/getMessage?account=${oldAccount}&pi=${pi}`, {'content-type': 'application/activity+json'});
      if(re.code===200){
        insertData(re.message.rows,actorName,domain,avatar)
  
        if((pi-1)*10+ re.message.rows.length>=re.message.total) {break;}
  
      }else break;
      pi++
    }
    
    console.log('4444444444')
  }
  else {
    let sql='UPDATE a_message SET actor_name=?,actor_url=?,actor_inbox=?,actor_account=? WHERE actor_account=?'
    let paras=[actorName,`https://${domain}/api/activitepub/users/${actorName}`,`https://${domain}/api/activitepub/inbox/${actorName}`,`${actorName}@${domain}`,oldAccount];
    await execute(sql,paras);
  } 


   

 

  res.status(200).json({ msg:'ok'}); 
  
});
