
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
async function add(daoid,did,title,content,isSend,isDiscussion)
{
    return await common.executeID('INSERT INTO a_discussion (dao_id,member_address,title,content,is_send,is_discussion) VALUES(?,?,?,?,?,?)'
    ,[daoid,did,title,content,isSend,isDiscussion]);
}

async function addCommont(id,did,content)
{
    return await common.executeID('INSERT INTO a_discussion_commont (pid,member_address,content) VALUES(?,?,?)'
    ,[id,did,content]);
}


//删除
async function del(id,replyLevel)
{
    if(replyLevel=='0') return await common.execute('delete from a_discussion where id=?',[id]);
    else return await common.execute('delete from a_discussion_commont where id=?',[id]);
}


//修改标题
async function edit(id,title,content,isSend)
{
    return await common.execute('update a_discussion set title=?,content=?,is_send=? where id=?',[title,content,isSend,id]);
}

//修改是否允许评论
async function editDiscussion(id,flag)
{
    return await common.execute('update a_discussion set is_discussion=? where id=?',[flag,id]);
}

 //获取一条讨论
async function getOne(id)
{
    let re= await common.getData('SELECT * FROM v_discussion WHERE id=? ',[id]);
    return re?re:[];
}

//获取评论
async function getFromPid(pid)
{
    let re= await common.getData('SELECT * FROM v_discussion_commont WHERE pid=?',[pid]);
    return re?re:[];
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
    let re= await common.getPageData('discussions',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}


module.exports = {
    add,del,edit,editDiscussion,getOne,getData,getFromPid,addCommont
 }

