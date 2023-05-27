const crypto = require('crypto');
const common=require('./common')

async function saveUser(name,domain,actorHomeUrl,actorDesc,selectImg,daoid )
{
  return new Promise(function (resolve) {
   crypto.generateKeyPair('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
          },
          privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
          }
      }, async (err, publicKey, privateKey) => {
          // let apikey=crypto.randomBytes(16).toString('hex')
           let lok=await common.execute("INSERT INTO a_account(id,account,account_url,pubkey,privkey,actor_home_url,icon,actor_desc) VALUES(?,?,?,?,?,?,?,?)",
           [daoid,`${name}@${domain}`,`https://${domain}/u/${name}`,publicKey,privateKey,actorHomeUrl,selectImg,actorDesc]
           );
           if(lok) resolve('ok');
           else resolve('');
      });
  })
}


async function updateUser(name,domain,actorHomeUrl,actorDesc,selectImg,daoid )
{
  if(selectImg)
    return await common.execute("update a_account set account=?,account_url=?,actor_home_url=?,icon=?,actor_desc=? where id=?",
    [`${name}@${domain}`,`https://${domain}/u/${name}`,actorHomeUrl,selectImg,actorDesc,daoid]);
  else 
    return await common.execute("update a_account set account=?,account_url=?,actor_home_url=?,actor_desc=? where id=?",
    [`${name}@${domain}`,`https://${domain}/u/${name}`,actorHomeUrl,actorDesc,daoid]);
}


async function updateActor(actorName,actorDesc,selectImg,did )
{
    return await common.execute("call i_actor(?,?,?,?)",
    [did,selectImg,actorDesc,actorName]);
}


async function getUser (findFiled,findValue,selectFields) {
  let re=await common.getData(`select ${selectFields} from a_account where ${findFiled}=?`,
  [findValue]);
  return re.length?re[0]:{};
}



async function getActor (did) {
  let re=await common.getData(`select * from a_actor where member_address=?`, [did]);
  return re.length?re[0]:{member_address:did,member_icon:'',member_nick:'',member_desc:''};
}

async function getDaoFromDid(did)
{
  let re=await common.getData('SELECT a.*,b.dao_name,b.dao_manager,b.dao_logo,c.account,c.icon FROM (SELECT dao_id,member_type FROM t_daodetail WHERE member_address=?) a JOIN t_dao b ON a.dao_id=b.dao_id LEFT JOIN a_account c ON a.dao_id=c.id',[did])
  return re || []
}

async function getAccount(did)
{
  let re=common.getData("SELECT * FROM v_account WHERE dao_id IN(SELECT dao_id FROM t_daodetail WHERE member_address=?)",[did])
  return re || []

}


async function getAccountFromDaoid(daoid)
{
  let re=common.getData("SELECT * FROM v_account WHERE dao_id =?",[daoid])
  return re || []

}

module.exports = {
    saveUser
    ,updateActor
    ,getActor
    ,getUser
    ,getAccount
    ,updateUser
    ,getAccountFromDaoid
    ,getDaoFromDid
 }