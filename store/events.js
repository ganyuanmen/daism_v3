
const common=require('./common')



/**
 * 增加
 * @param {*} cid  getTime生成的ID
 * @param {*} daoid 
 * @param {*} did 
 * @param {*} title 
 * @param {*} content 
 * @param {*} isSend 
 * @param {*} isDiscussion 
 * @returns 
 */
async function add(daoid,did,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address)
{
    return await common.executeID('INSERT INTO a_events (dao_id,member_address,title,content,is_send,is_discussion,top_img,start_time,end_time,event_url,original,numbers,participate,address) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'                          
    ,[daoid,did,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address]);
}

//删除
async function del(id,replyLevel)
{
    if(replyLevel=='0')  return await common.execute('delete from a_events where id=?',[id]);
    else if(replyLevel=='1')  return await common.execute('delete from a_events_commont where id=?',[id]);
    else  return await common.execute('delete from a_events_reply where id=?',[id]);
}

//修改        
async function edit(id,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address)
{
    if(topImg)
        return await common.execute('UPDATE a_events SET title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,original=?,numbers=?,participate=?,address=? WHERE id=?'
        ,[title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,id]);
    else 
        return await common.execute('UPDATE a_events SET title=?,content=?,is_send=?,is_discussion=?,start_time=?,end_time=?,event_url=?,original=?,numbers=?,participate=?,address=? WHERE id=?'
        ,[title,content,isSend,isDiscussion,startTime,endTime,eventUrl,original,numbers,participate,address,id]);

}

//修改是否允许评论
async function editDiscussion(id,flag)
{
    return await common.execute('update a_events set is_discussion=? where id=?',[flag,id]);
}


//修改是否允许回复
async function editReply(id,flag)
{
    return await common.execute('update a_events_commont set is_discussion=? where id=?',[flag,id]);
}

 //获取一条讨论
async function getOne(id)
{
    let re= await common.getData('SELECT * FROM v_events WHERE id=?',[id]);
    return re?re:[];
}

 //获取参与者
 async function getJoin(id)
 {
     let re= await common.getData('SELECT * FROM v_events_join WHERE pid=? order by id desc',[id]);
     return re?re:[];
 }

 //增加参与者
 async function addJoin(pid,did,content,flag)
 {
    let data=await common.getData('SELECT participate FROM a_events WHERE id=?',[pid]);
    let _participate=0
    if(data.length && data[0].participate=='0')  _participate='2' //匿名
    return await common.executeID('INSERT INTO a_events_join (pid,member_address,content,flag) VALUES(?,?,?,?)',[pid,did,content,_participate]);
 }

 //删除参与者
 async function delJoin(id)
 {
    return await common.execute('delete from a_events_join where id=?',[id]);
 }
 
 //参与者审核
 async function updateVerify(id,flag)
 {
    return await common.execute('update a_events_join set flag=? where id=?',[flag,id]);
 }

//新增加评论
async function addComment(pid,did,content)
{
    return await common.execute("INSERT INTO a_events_commont (pid,member_address,content) VALUES(?,?,?)",[pid,did,content])
}

//新增回复
async function addReply(pid,did,nick,icon,content)
{
    return await common.execute("INSERT INTO a_events_reply(pid,member_address,member_nick,member_icon,content) VALUES(?,?,?,?,?)",[pid,did,nick,icon,content])
}

//获取评论
async function getFromPid(pid)
{
    let re= await common.getData('SELECT * FROM v_events_commont WHERE pid=? order by id desc',[pid]);
    return re?re:[];
}
 
//获取回复
async function geRely(pid)
{
    let re= await common.getData('SELECT * FROM v_events_reply WHERE pid=? order by id desc',[pid]);
    return re?re:[];
}

//统计人数:

async function eventsSum(pid)
{   
    let data={amount:0,noAudit:0}
    let re= await common.getData('SELECT COUNT(*) amount FROM a_events_join WHERE pid=? and flag>0 ',[pid]);
    if(re && re[0]) data.amount=re[0].amount
    re= await common.getData('SELECT COUNT(*) amount FROM a_events_join WHERE pid=? and flag=0 ',[pid]);
    if(re && re[0]) data.noAudit=re[0].amount
    return data;
}



 /**
  * 获取分页数据
  * @param {*} tid 数据id，数据库中定义的,从哪里取数据
  * @param {*} ps 每页记录数
  * @param {*} pi 第几页,从1开始 
  * @param {*} s 排序字段
  * @param {*} a 排序方式 asc 或desc 
  * @param {*} w 查询条件
  * @returns 
  */
async function getData(ps,pi,daoid)
{
    let re= await common.getPageData('events',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}


module.exports = {
    add,del,edit,editDiscussion,getOne,getData,getFromPid,geRely,getJoin,addJoin,delJoin,addComment,addReply,editReply,eventsSum,updateVerify
 }

