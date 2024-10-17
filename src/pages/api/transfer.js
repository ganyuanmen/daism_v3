const { ethers } = require('ethers');

import withSession from "../../lib/session";
import { getData,execute } from "../../lib/mysql/common";



export default withSession(async (req, res) => {
    if (req.method.toUpperCase()!== 'POST')  return res.status(200).json({errMsg:'Method Not Allowed'})
    const sessionUser = req.session.get('user');
    if (!sessionUser || sessionUser.did==='') return res.status(200).json({errMsg:'No wallet signature login'})

    
    let rows=await getData("SELECT * FROM t_ad WHERE id=?",[sessionUser.did])
    if(rows.length) return res.status(200).json({errMsg:`${sessionUser.did} already get.`})

    try{
        const provider = new ethers.JsonRpcProvider(process.env.HTTPS_URL);
        const wallet = new ethers.Wallet('b61174e37c12516dfdb730c27d62350283918c576eec70db66c47a7fe8fa091f', provider);
        const tx = {
        to: sessionUser.did,
        value: ethers.parseEther(process.env.BLOCKCHAIN_NETWORK==='holesky'?'0.5':(process.env.BLOCKCHAIN_NETWORK==='sepolia'?'0.2':'0')) // 转账金额，以以太为单位
    };

    const txResponse = await wallet.sendTransaction(tx);
    await execute("insert into t_ad(id) values(?)",[sessionUser.did])
    res.status(200).json({hash: txResponse.hash});
    }
    catch(err)
    {
        console.error('post:/api/postwithsession:',req.headers.method,req.body,err)
        res.status(500).json({errMsg: 'fail'});
    }  
});






// export default async function handler(req, res) {
//     let _address=req.body.toAddress
//     // 连接到一个以太坊节点
//     const provider = new ethers.JsonRpcProvider('https://holesky.infura.io/v3/982d49c829f4428db93d5a077085d995');

//     // 创建一个钱包实例
//     const wallet = new ethers.Wallet('b61174e37c12516dfdb730c27d62350283918c576eec70db66c47a7fe8fa091f', provider);
//     const tx = {
//         to: _address,
//         value: ethers.parseEther('0.5') // 转账金额，以以太为单位
//     };

//     const txResponse = await wallet.sendTransaction(tx);
//     console.log('Transaction hash:', txResponse.hash);

//     // await txResponse.wait(); // 等待交易确认

  
//    res.status(200).json({hash: txResponse.hash});  
// }
