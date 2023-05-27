const Web3 = require('web3')
const Daoapi = require("./src/index")
var mysql = require('mysql');
var fs = require("fs");
const schedule =require("node-schedule");
//每隔10分钟需要重新订阅一次
//isError 是否发生错误
//count 记数器,每分钟记一次，达到10时，重新订阅
var monitor = { isError: false, count: 0 }
var web3; 
// var selectAcouunt = '0x75EFcbeC4961D6FD3B77F271ce9e5cb7458cb69E'; //启动者钱包地址
var selectAcouunt = '0x43Bf444eDBcA3d95656f0c11b4174b95A82B98AE'; //启动者钱包地址
var daoapi;   //api 包
async function daoListenStart() {
  try{
    monitor.count = 0;
    if (daoapi && daoapi.unsub) {daoapi.unsub()}
    if (web3 && web3.currentProvider && web3.currentProvider.close) {await web3.currentProvider.close();}
   // web3 = await new Web3("wss://goerli.infura.io/ws/v3/9676a35d629d488fb90d7eac1348c838");
   web3 = await new Web3("wss://sepolia.infura.io/ws/v3/9676a35d629d488fb90d7eac1348c838");
 //  web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'))
   // daoapi = new Daoapi(web3, selectAcouunt,'goerli');
   daoapi = new Daoapi(web3, selectAcouunt,'sepolia');
  // daoapi = new Daoapi(web3, selectAcouunt,'local');
    daoListen();
  }catch(e){console.log('运行错误',e);
    monitor.count=1000; 
  }
}

//读取mysql 帐号密码
var data = fs.readFileSync('./sn.txt', 'utf8');
var _json = JSON.parse(data)
var pool; // 连接池
var maxData = []; // 记录已监听的最区块号

// //处理未及时监听的数据
// function handHistory()
// {
//   //10秒后执行，待正常监听结束
//   setTimeout(() => {
//     pool.getConnection(function(err, conn){
//       if(err) throw err;
//        conn.query("SELECT a.app_index,b.dao_id FROM t_app a CROSS JOIN t_dao b WHERE a.app_index>1 ", function (error, results, fields) {
//             results.forEach(element => {
//               daoapi.dao_appInfo.getInfo(element.dao_id,element.app_index).then(e=>{
//                 if(parseInt(e.index)>0) {
//                   let _sql='CALL i_appinstall(?,?,?)'
//                   let _paras=[element.dao_id,element.app_index,0]
//                   executeSql(_sql, _paras);
//                 }
//               })
//             });
//         });
//       conn.release();
//     });
//    }, 10000);
// }

//处理监听
function hand() {
  //创建mysql连接池
    pool =  mysql.createPool({host: _json.host,user: _json.user,password: _json.password,database: _json.database});
   
    //从数据库获取需要监听的最大区块号
    let sql = 'SELECT IFNULL(MAX(block_num),0) s FROM t_dao'  //0 
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_setlogo'  //1
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_changelogo' //2
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_token'  //3
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_u2t'  //4
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_t2u'  //5
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_e2t'  //6
        + ' union all SELECT IFNULL(MAX(block_num),0) FROM t_eth_utoken' //7
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_gastoken_utoken'  //8
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_proexcu'  //9
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_app'  //10
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_appversion'  //11
        + ' UNION ALL SELECT IFNULL(MAX(block_num),0) FROM t_appinstall';  //12

    pool.getConnection(function(err, conn){
              if(err) throw err;
              conn.query(sql, function (error, results, fields) {
                console.log(results);
                if (error) throw error;
                maxData = [];
                //缓存最大区块号
                results.forEach(element => {maxData.push(element.s)});
                console.log("start...........")
                daoListenStart();  //监听
                // handHistory();  //处理历史未监听
              
                //1分钟循环执行
                schedule.scheduleJob("5 * * * * *",async() => {
                          if (monitor.isError) {p("ERROR restaet web3 listener!!!!!!!!!!!!!!!!!!!!!!!!!!!!"); daoListenStart();}
                          if (monitor.count > 10) {p(" Time out restaet web3");daoListenStart();}
                          monitor.count++;  
                  });
              });
             conn.release();
    }); 
}


//监听
function daoListen() {
  p("daoapi version:" + daoapi.version);
  //createDao 创建dao事件处理
  daoapi.DaoRegistrar.daoCreateEvent(maxData[0], (obj) => {
    console.log(obj)
    const {data}=obj
    let sql ="call i_dao(?,?,?,?,?,?,?,?,?,?)";
    try {
        let params = [data['daoId'],obj.blockNumber,data['name'],data['symbol'],data['describe'],data['manager']
        ,data['time'],data['address'],data['creator'],data['delegator']];
        maxData[0] = obj.blockNumber;  //缓存最后区块号
        executeSql(sql, params); //dao 信息
        for(let i=0;i<data['accounts_votes'].length;i++)
        {
            sql="call i_daodetail(?,?,?,?)"
            params=[data['daoId'],data['accounts_votes'][i]['account'],data['accounts_votes'][i]['vote'],i]
            executeSql(sql, params); //成员及票权信息
        }
    } catch (e) {console.error(e);}
  });

  // publishtoken dao发布token事件
  daoapi.DaoToken.publishTokenEvent(maxData[3], obj => {
    const {data}=obj
    console.log(data);
    let sql = "call i_token(?,?,?,?)";
    try {
        let params = [data['daoId'],data['tokenId'],obj.blockNumber, data['timestamp']];
        maxData[3] = obj.blockNumber ; //缓存最后区块号
        executeSql(sql, params);
    } catch (e) {console.error(e);}
  })

     //以下的监听需要dao条件下才能处理，所以延迟监听
     setTimeout(() => listen_attach(), 5000);
        
     //延迟监听兑换，需要处理前期事件
     setTimeout(() => listen_swap(),8000);

}


//统计个人当前的token 值
function token_cost(id, address) {
    daoapi.DaoToken.balanceOf(id, address).then(e => {
        let sql = "CALL excuteToken(?,?,?)";
        let params = [id, address, e];
        executeSql(sql, params);
    })
  }


  //mysql 处理
  function executeSql(addSql, addSqlParams) {
    pool.getConnection(function(err, conn){
      if(err){console.log("getConnection error"); return;}
      conn.query(addSql, addSqlParams, function (err, result) {
          if (err) {console.log('[INSERT ERROR] - ', err.message);return;}
      });
      conn.release();
   });

}

//屏幕打印
function p(k) {
    var myDate = new Date();
    console.log(myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + "-->" + k)
}

function listen_swap()
{
      //u2t token 兑换 token 事件
    daoapi.IADD.utokenTotokenEvent(maxData[4], async obj => {
        console.log(obj);
        const {data}=obj
        let sql = "call i_u2t(?,?,?,?,?,?,?,?,?)";
        try{
          let cost = await daoapi.IADD.getPool(data.tokenId); // 流动池中 dao 的当前币值（utoken）
          console.log(cost)
          let params = [obj.blockNumber, data['tokenId'], cost.utoken, data['from'], data['to'], data['utoken'], data['token'], data['swap_time'],obj.transactionHash];
          maxData[4] = obj.blockNumber; //缓存最后区块号
          executeSql(sql, params);
          token_cost(data.tokenId, data.to); //统计个人当前的token 值
        }catch(e){console.error(e)}
    })

    //t2u token 兑换 utoken 事件
    daoapi.IADD.tokenToUtokenEvent(maxData[5], async obj => {
        console.log(obj);
        const {data}=obj
        let sql = "call i_t2u(?,?,?,?,?,?,?,?,?)";
        try{
         let cost = await daoapi.IADD.getPool(data.tokenId);// 流动池中 dao 的当前币值（utoken）
          let params = [obj.blockNumber, data['tokenId'], cost.utoken, data['from'], data['to'], data['utoken'], data['token'], data['swap_time'],obj.transactionHash];
          maxData[5] = obj.blockNumber; //缓存最后区块号
          executeSql(sql, params);
          token_cost(data.tokenId, data.from);  //统计个人当前的token 值
        }catch(e){console.error(e)}
    })

    // //t2t token 兑换 token 
    // daoapi.IADD.tokenTotokenEvent(maxData[6], async obj => {
    //     console.log(obj);
    //     const {data}=obj
    //     let sql = "call i_t2t(?,?,?,?,?,?,?,?,?,?,?)";
    //    try{
    //     //  let cost1 = await daoapi.IADD.getPool(data.data.fromTokenId); // 流动池中 dao 的当前币值（utoken）
    //     //  let cost2 = await daoapi.IADD.getPool(data.data.toTokenId);// 流动池中 dao 的当前币值（utoken）
    //       let params = [obj.blockNumber, data.fromTokenId, data.toTokenId, 0, 0, data.from, data.to, data.fromToken, data.toToken, data.swap_time,obj.transactionHash];
    //       maxData[6] = obj.blockNumber; //缓存最后区块号
    //       executeSql(sql, params);
    //       token_cost(data.toTokenId, data.to); //统计个人当前的token 值
    //       token_cost(data.fromTokenId, data.from); //统计个人当前的token 值
    //    }catch(e){console.log(e)}

    // })
    
      //eth to utoken eth 兑换 utoken
      daoapi.IADD.ETHToDaoToken(maxData[6], obj => {
        console.log(obj);
        const {data}=obj
        let sql = "INSERT INTO t_e2t (block_num,from_address,to_address,in_amount,out_amount,swap_time,tran_hash) VALUES(?,?,?,?,?,?,?)";
        try{
            let params = [obj.blockNumber, data['from'],  data['to'], data['input_amount'],data['output_amount'],data['swap_time'],obj.transactionHash];
            maxData[6] = obj.blockNumber; //缓存最后区块号
            executeSql(sql, params);
        }catch(e){console.log(e)}
    })

        //eth to utoken eth 兑换 utoken
    daoapi.UnitToken.swapEvent(maxData[7], obj => {
        console.log(obj);
        const {data}=obj
        let sql = "call i_swap(?,?,?,?,?,?)";
        try{
            let params = [obj.blockNumber, data['address'], data['swapTime'], data['ethAmount'], data['utokenAmount'],obj.transactionHash];
            maxData[7] = obj.blockNumber; //缓存最后区块号
            executeSql(sql, params);
        }catch(e){console.log(e)}
    })

        //GasToken to utoken 
    daoapi.UnitToken.swapByGasToken(maxData[8], obj => {
        console.log(obj);
        const {data}=obj
        let sql = "call i_swapdeth(?,?,?,?,?,?,?)";
        try{
            let params = [obj.blockNumber, data['fromAddress'], data['swapTime'], data['ethAmount'], data['utokenAmount'], data['toAddress'],obj.transactionHash];
            maxData[8] = obj.blockNumber; //缓存最后区块号
            executeSql(sql, params);
        }catch(e){console.log(e)}
    })      
}

 function listen_attach()
 {
       //setlogo 创建dao logo 事件
    daoapi.DaoLogo.setLogoEvent(maxData[1], obj => {
        const {data}=obj
        console.log(obj)
        let sql = "call i_setlogo(?,?,?,?)";
        try {
          let params = [data['daoId'], obj.blockNumber, data['timestamp'], data['src']];
          maxData[1] = obj.blockNumber; //缓存最后区块号
          executeSql(sql, params);
       } catch (e) {console.error(e);}
    })

    //chanelogo 修改 dao logo 事件
    daoapi.DaoLogo.changeLogoEvent(maxData[2], obj => {
      console.log(obj)
      const {data}=obj
        let sql = "call i_changelogo(?,?,?,?)";
        try {
          let params = [data['daoId'], obj.blockNumber, data['timestamp'], data['src']];
          maxData[2] = obj.blockNumber ;//缓存最后区块号
          executeSql(sql, params);
      } catch (e) {console.error(e);}
    })

    //app install 事件处理
    daoapi.DaoPluginManage.installEvent(maxData[12], (obj) => {
      console.log(obj)
      const {data}=obj
      let sql ="INSERT INTO t_appinstall(block_num,dao_id,delegate_id,app_type,app_id,app_version,install_address,install_time) VALUES(?,?,?,?,?,?,?,?)";
      try {
          let params = [obj.blockNumber,data['dao_id'],data['delegate_id'],1,data['app_id'],data['app_version'],data['install_address'],data['install_time']];
          maxData[12] = obj.blockNumber;  //缓存最后区块号
          executeSql(sql, params); //dao 信息
      } catch (e) {console.error(e);}
    });

      //execEvent 执行提案事件
    daoapi.EventSum.execEvent(maxData[9],obj => {
        console.log(obj);
        const {data}=obj
        let sql = "CALL excu_pro(?,?,?,?)";
        try{
          
          let params = [obj.blockNumber, data['proHash'],data['address'], data['time']];
          maxData[9] = obj.blockNumber; //缓存最后区块号
          executeSql(sql, params);
       }catch(e){console.log(e)}
    })

  //appadd 登记app 地址事件
    daoapi.App.addAppEvent(maxData[10], async (obj) => {
      console.log(obj);
      const {data}=obj
      let sql ="call i_app(?,?,?,?,?,?,?,?,?,?)";
      try {
          let params = [obj.blockNumber,data['name'],data['app_id'],data['version'],data['desc'],data['appAddress']
          ,data['manager'],data['time'],data['ver_desc'],data['software_type']];
          maxData[10] = obj.blockNumber; //缓存最后区块号
          executeSql(sql, params);
      } catch (e) {console.error(e);}
    });

      
  //   // 登记app 版本事件
  // daoapi.App.addVersionEvent(maxData[11], async (obj) => {
  //   console.log(obj);
  //   const {data}=obj
  //   let sql ="call i_app(?,?,?,?,?,?,?,?,?,?)";
  //   try {
  //       let params = [obj.blockNumber,data['name'],data['index'],data['version'],data['desc'],data['appAddress']
  //       ,data['manager'],data['time'],data['ver_desc'],data['software_type']];
  //       maxData[10] = obj.blockNumber; //缓存最后区块号
  //       executeSql(sql, params);
  //   } catch (e) {console.error(e);}
  // });

 }


 
// 开始监听
hand();

