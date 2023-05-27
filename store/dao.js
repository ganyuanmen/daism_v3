const common=require('./common')

//获取加入DAO列表 
async function getInviteDao(did)
{
    let re= await common.getData(`SELECT a.id dao_id,a.account,a.icon,b.dao_name,b.dao_logo,b.dao_manager,IFNULL(c.flag,-1) flag,IFNULL(c.id,0) id 
    FROM (SELECT id,account,icon FROM a_account WHERE id NOT IN(SELECT dao_id FROM t_daodetail WHERE member_address=? AND member_type=1)) a JOIN t_dao b ON a.id=b.dao_id
    LEFT JOIN (SELECT  dao_id,flag,id FROM a_invite WHERE member_address=?) c ON a.id=c.dao_id`,[did,did]);
    return re || []
}
 
 //获取审批列表
async function getVerifyDao(did)
{
    let re= await common.getData('SELECT * FROM v_invite WHERE dao_id IN(SELECT dao_id FROM t_dao WHERE dao_manager=?) ORDER BY id DESC',[did]);
    return re || []
}

 
 //成员列表
 async function getDaoMembers(daoid)
 {
     let re= await common.getData('SELECT * FROM v_members WHERE dao_id=?',[daoid]);
     return re || []
 }

//申请加入
async function inviteAdd(did,daoid,info)
{
    return await common.execute('INSERT INTO a_invite (dao_id,member_address,info) VALUES(?,?,?)',[daoid,did,info]);
}

//撤回申请
async function delInvite(id)
{
    return await common.execute('delete from a_invite where id=?',[id]);
}

//通过申请 flag 1->通过 2->驳回
async function approve(id,flag)
{
    return await common.execute('call exec_daomember(?,?)',[id,flag]);
}


 //主页数据
 async function getHomeData(daoid)
 {
     let re1= await common.getData('SELECT id,title,times,member_icon,member_address,member_nick FROM v_discussion where dao_id=? ORDER BY id DESC LIMIT 4',[daoid]);
     let re2= await common.getData('SELECT id,title,times,member_icon,member_address,member_nick FROM v_news where dao_id=? ORDER BY id DESC LIMIT 4',[daoid]);
     let re3= await common.getData('SELECT id,title,top_img,member_address,start_time,member_nick,member_icon FROM v_events where dao_id=? ORDER BY id DESC LIMIT 4',[daoid]);
     return {
        discussion: re1 || [],
        news:re2 || [],
        events:re3 || [],
    }
 }

module.exports = {
    getInviteDao,inviteAdd,delInvite,approve,getVerifyDao,getDaoMembers,getHomeData
 }