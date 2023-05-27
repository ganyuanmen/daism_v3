
const dbConfig = require('../mysql_config.json');
const mysql = require('mysql');

class DB {
  static pool = DB.initPool()
  static initPool () {
    return mysql.createPool(dbConfig)
  }
}

const pool=DB.pool;

//mysql 处理
function execute(sql, sqlParams) {
    console.log(`execute: ${sql}`)
    return new Promise(function (resolve) {
        pool.getConnection(function(err, conn){
        if(err){console.log("getConnection error",(err&&err.message)?err.message:err); resolve(false);}
        else conn.query(sql, sqlParams, function (err, result) {
                if (err) {console.log('[execute ERROR] - ', (err&&err.message)?err.message:err);resolve(false);}
                else resolve(true);
             });
        conn.release();
        });
    })
}


//mysql 返回自增ID
function executeID(sql, sqlParams) {
    console.log(`executeID: ${sql}`)
    return new Promise(function (resolve) {
        pool.getConnection(function(err, conn){
        if(err){console.log("getConnection error",(err&&err.message)?err.message:err); resolve(0);}
        else conn.query(sql, sqlParams, function (err, result) {
                if (err) {console.log('[execute ERROR] - ', (err&&err.message)?err.message:err);resolve(0);}
                else resolve(result.insertId);
             });
        conn.release();
        });
    })
}


//取mysql数据
function getData(sql, sqlParams)
{
    console.log(`getData: ${sql}`)
    return new Promise(function (resolve) {
        pool.getConnection(function(err, conn){
            if(err){console.log("getConnection error",(err&&err.message)?err.message:err); resolve([]);}
            else conn.query(sql, sqlParams, function (err, result) {
                    if (err) {console.log('[getData ERROR] - ', (err&&err.message)?err.message:err);resolve([]);}
                    else resolve(result)
                  });
            conn.release();
        })
    })
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
 async function getPageData(tid,ps,pi,s,a,w)
 {
     let re= await getData('call get_page(?,?,?,?,?,?)',[tid,ps,pi,s,a,w]);
     return {
        rows:re[0],
        total:re[1][0]['mcount'],
        pages:Math.ceil(re[1][0]['mcount']/ps)
     }
 }


module.exports = {
    execute
    ,getData
    ,getPageData
    ,executeID
 }