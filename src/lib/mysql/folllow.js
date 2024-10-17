import { getData,execute,getJsonArray } from './common'

//一个
export async function getFollow ({actorAccount,userAccount}) {
    let re=await getData(`select * from v_follow where actor_account=? and user_account=?`,[actorAccount,userAccount]);
    return re.length?re[0]:{};
  }
 
  //集合 actor 粉丝集 是谁关注 我
  export async function getFollowers ({account}) {  //true-> 给其它软件读取
    let sql='SELECT * FROM v_follow WHERE actor_account=?'
    let re=await getData(sql,[account]);
    return re || []
  }
  
   //我关注谁
   export async function getFollow0 ({account}) {  
    return await getJsonArray('follow0',[account])
  }

  
   //谁关注我
   export async function getFollow1 ({account}) {  
    return await getJsonArray('follow1',[account])
  }
  
  //集合actor 偶像集  我关注谁
export async function getFollowees ({account}) {
    let sql='SELECT * FROM v_follow WHERE user_account=?'
    let re=await getData(sql,[account]);
    return re || []
  }
  
  // 保存
  export  async function saveFollow({actor,user,followId})
  {
    return await execute("INSERT INTO a_follow(follow_id,actor_account,actor_url,actor_inbox,actor_avatar,user_account,user_url,user_avatar,user_inbox) VALUES(?,?,?,?,?,?,?,?,?)",
    [followId,actor.account,actor.url,actor.inbox,actor.avatar,user.account,user.url,user.avatar,user.inbox]);
  }
  
    // 删除
 export async function removeFollow(followId)
  {
    return await execute("delete from a_follow where follow_id=?", [followId]);
  }
