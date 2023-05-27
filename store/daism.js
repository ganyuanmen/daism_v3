
const common=require('./common')

//提案增加
async function proAdd({daoId,appId,appType,proType,proHash,address,proName,logoImg,functionName,functionPara,appAddress,causeAddress})
{
    return await common.execute('INSERT INTO t_pro(dao_id,app_id,app_type,pro_type,pro_hash,pro_manager,pro_name,logo_img,function_name,function_para,app_address,cause_address) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
    ,[daoId,appId,appType,proType,proHash,address,proName,logoImg,functionName,functionPara,appAddress,causeAddress]);
}

//删除提案
async function proDel({proId})
{
    return await common.execute('delete from t_pro where pro_id=?',[proId]);
}

//增加签名
async function addVote({proId,voteSinger,address,memberVotes})
{
    return await common.execute('INSERT INTO t_provote(pro_id,vote_singer,member_address,member_votes) VALUES(?,?,?,?)',[proId,voteSinger,address,memberVotes]);
}
//获取签名数据
async function getVote({proId})
{
    let  sql=`SELECT a.vote_singer,a.member_address,b.member_index FROM t_provote a 
    JOIN (select * from t_daodetail where member_type=1) b ON a.member_address=b.member_address
    WHERE a.pro_id=? AND b.dao_id IN(SELECT dao_id FROM t_pro WHERE pro_id=?) order by member_index`
    let re= await common.getData(sql,[proId,proId]);
    return re || []
}

//兑换记录
async function getLogsData({ps,pi,did})
{
    let re= await common.getPageData('swap',ps,pi,'block_num','desc',`swap_address='${did}'`);
    return re 
}


//daos列表
async function getDaosData({ps,pi,orderField,orderType,searchText})
{
    searchText=searchText.replaceAll(' ','')
    let re= await common.getPageData('dao',ps,pi,orderField
    ,orderType?'asc':'desc'
    ,searchText?`dao_name like '%${searchText}%' or dao_symbol like '%${searchText}%' or dao_manager='${searchText}' or creator='${searchText}' `:"");
    return re 
}


//tokens列表
async function getDataToken({ps,pi,searchText,daoId})
{
    searchText=searchText.replaceAll(' ','')
    let re= await common.getPageData('daotoken',ps,pi,'dao_id','asc'
    ,searchText?`dao_symbol like '%${searchText}%' and dao_id>=${daoId}`:`dao_id>=${daoId}`);
    return re 
}



//我的tokens
async function getMyTokens({did})
{
    let re= await common.getData('SELECT * FROM v_tokenuser WHERE dao_manager=?',[did]);
    return re || []
}


//我的提案
async function getMyPros({did})
{
    let re= await common.getData('CALL get_proList(?)',[did]);
    return (re && re[0])?re[0]:[]
}

//我的Daos
async function getMyDaos({did})
{
    let re= await common.getData('SELECT * FROM v_dao WHERE dao_id in(select dao_id from t_daodetail where member_address=? and member_type=1)',[did]);
    return re || []
}


//Daodetail
async function getMyDaoDetail({daoid})
{
    let re= await common.getData('SELECT * FROM v_dao WHERE dao_id=?',[daoid]);
    if(re && re.length) re[0].child=await common.getData('select * from v_members where dao_id=?',[daoid])
    return re || []
}

//我的app
async function getMyApps({did})
{
    let re= await common.getData('SELECT * FROM v_app WHERE app_manager=?',[did]);
    if(re && re.length)
    {
        let sql=`SELECT a.*,IFNULL(b.dao_id,0) is_install,IFNULL(c.pro_id,0) pro_id FROM (
            SELECT dao_id, dao_name,dao_symbol,dao_logo FROM t_dao WHERE dao_id IN(SELECT dao_id FROM t_daodetail WHERE member_address=? and member_type=1)) a LEFT JOIN 
            (SELECT dao_id FROM t_appinstall WHERE app_id=? and app_type=?) b ON a.dao_id=b.dao_id LEFT JOIN 
            (SELECT pro_id,dao_id FROM t_pro WHERE app_id=? and app_type=?) c ON a.dao_id=c.dao_id`
        for(let i=0;i<re.length;i++)
        {
            const {app_id,app_type}=re[i]
            re[i].child=await common.getData(sql,[did,app_id,app_type,app_id,app_type])
        }
    }
    return re || []
}


//我的dao选择
async function getMyDaoData({did})
{
    let sql=`SELECT a.dao_id,a.dao_logo,a.dao_name,a.dao_symbol,IFNULL(b.delegate_id,0) delegate_id,IFNULL(c.pro_id,0) pro_id FROM t_dao a
    LEFT JOIN (SELECT delegate_id,dao_id FROM t_appinstall WHERE  app_id=1 AND app_type=1) b ON a.dao_id=b.dao_id LEFT JOIN 
    (SELECT dao_id, pro_id FROM t_pro WHERE app_id=1 AND app_type=1) c ON a.dao_id=c.dao_id WHERE a.dao_manager=?`
    let re= await common.getData(sql,[did])
    return re || []
}

async function addPro({daoId,appId,appType,proType,proHash,address,proName,logoImg,functionName,functionPara,appAddress,causeAddress})
{
    let sql='INSERT INTO t_pro(dao_id,app_id,app_type,pro_type,pro_hash,pro_manager,pro_name,logo_img,function_name,function_para,app_address,cause_address) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
    return await common.executeID(sql,[daoId,appId,appType,proType,proHash,address,proName,logoImg,functionName,functionPara,appAddress,causeAddress]);
}

async function getPro({appId,appType,daoId,did}) 
{
    let re=await common.getData('CALL get_pro(?,?,?,?)',[daoId,appId,did,appType])
    return (re && re[0])?re[0]:[]

}

module.exports = {
    getLogsData,getMyTokens,getMyDaos,getMyApps,getMyDaoDetail,proAdd,getMyPros,proDel,getVote,addVote,getDaosData,getDataToken,getMyDaoData,addPro,getPro
 }

