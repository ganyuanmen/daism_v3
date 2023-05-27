const common=require('./common')

 
async function saveMessage(actor,messageId,content,followerUrl,type,title,pid)
{
  return await common.execute("INSERT INTO a_message(actor_account,actor_url,message_id,content,follower_url,actor_icon,message_type,title,pid) VALUES(?,?,?,?,?,?,?,?,?)",
  [actor.account,actor.url,messageId,content,followerUrl,actor.icon,type,title,pid]);
}

async function getMessage (messageId) {
    let re=await common.getData('select content from a_message where message_id=?',[messageId]);
    return re.length?re[0]:{};
}


async function getMessageFromId (messageId) {
    let re=await common.getData('select * from a_message where id=? or pid=?',[messageId,messageId]);
    return re || []
}
  
async function getMessages (userAccount) {
    let re=await common.getData('SELECT * FROM a_message WHERE actor_account=? OR actor_account IN(SELECT actor_account FROM a_follow WHERE follow_type=0 AND user_account=?) order by id desc'
       ,[userAccount,userAccount]);
    return re || []
}


module.exports = {
    saveMessage,getMessage,getMessages,getMessageFromId
 }