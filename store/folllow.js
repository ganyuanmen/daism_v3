const common=require('./common')

//actor 粉丝
async function getFollower (actorAccount,userAccount,fields) {
    let re=await common.getData(`select ${fields} from a_follow where actor_account=? and user_account=? and follow_type=1`,[actorAccount,userAccount]);
    return re.length?re[0]:{};
  }
  
  
  //actor 粉丝集
  async function getFollowers (account) {  //true-> 给其它软件读取
    let sql='SELECT actor_account,actor_url,actor_inbox,actor_icon,follow_id,createTime FROM a_follow WHERE user_account=? and follow_type=1'
    let re=await common.getData(sql,[account]);
    return re || []
  }
  

  //actor 粉丝集
  async function getDaoFollowers (daoid) {  
    let sql='SELECT actor_account,actor_icon,createtime FROM a_follow WHERE dao_id=? and follow_type=1'
    let re=await common.getData(sql,[daoid]);
    return re || []
  }
  
  
//偶像
async function getFollowee (actorAccount,userAccount,fields) {
    let re=await common.getData(`select ${fields} from a_follow where actor_account=? and user_account=? and follow_type=0`,[actorAccount,userAccount]);
    return re.length?re[0]:{};
  }
  
  
  //actor 偶像集
  async function getFollowees (account) {
    let sql='SELECT actor_account,actor_url,actor_inbox,actor_icon,follow_id,createTime FROM a_follow WHERE user_account=? and follow_type=0'
    let re=await common.getData(sql,[account]);
    return re || []
  }
  
  async function saveFollow(actor,user,followId,followType,daoid)
  {
    
    return await common.execute("INSERT INTO a_follow (actor_account,actor_url,actor_inbox,actor_icon,actor_pubkey,user_name,user_domain,user_account,user_url,follow_id,follow_type,dao_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    [actor.account,actor.url,actor.inbox,actor.icon,actor.pubkey,user.name,user.domain,user.account,user.url,followId,followType,daoid]);
  }
  
  async function removeFollow(followId)
  {
    return await common.execute("delete from a_follow where follow_id=?", [followId]);
  }

  
module.exports = {
     getFollower
    ,getFollowers
    ,getFollowee
    ,getFollowees
    ,saveFollow
    ,removeFollow
    ,getDaoFollowers
 }