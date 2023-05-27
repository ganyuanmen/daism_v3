
const common=require('./common')

async function add(topImg,daoid,did,title,content)
{
    return await common.executeID('INSERT INTO a_news(top_img,dao_id,member_address,title,content) VALUES(?,?,?,?,?)'                          
    ,[topImg,daoid,did,title,content]);
}


//删除
async function del(id)
{
    return await common.execute('delete from a_news where id=?',[id]);
}


//修改标题
async function edit(title,topImg,content,id)
{
    if(topImg) return await common.execute('update a_news set title=?,top_img=?, content=? where id=?',[title,topImg,content,id]);
    else  return await common.execute('update a_news set title=?,content=? where id=?',[title,content,id]);
}


 //获取一条讨论
 async function getOne(id)
 {
     let re= await common.getData('SELECT * FROM v_news WHERE id=? ',[id]);
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
    let re= await common.getPageData('news',ps,pi,'id','desc',`dao_id=${daoid}`);
    return re 
}


module.exports = {
    add,del,edit,getOne,getData
 }

