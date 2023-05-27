'use strict';
const siwe=require('siwe')
const { generateNonce, ErrorTypes, SiweMessage } = siwe;
const redisClient=require('../redis')
const utils=require("../utils")

const express = require('express'), store=require("../store"),
      router = express.Router();

      /**
       * 退出登录
       */
router.get('/exit',async (req,res)=>{
    const {did}=req.headers
    await redisClient.remove(did) 
    res.status(200).send('ok')
})

router.get('/nonce', async function (req, res) {
    let token = generateNonce();
    await redisClient.set(token,'1',60)
    res.status(200).send(token)
    
});

/**
 * siwe登录
 */
router.post('/verify', async function (req, res) {
    try {
        if (!req.body.message) {res.status(422).json({ errMsg: 'Expected prepareMessage object as body.' });return;}
        let message = new SiweMessage(req.body.message);
        const fields = await message.validate(req.body.signature);
        let nonce=await redisClient.get(fields.nonce)
        if (!nonce) {res.status(422).json({errMsg: `Invalid nonce.`});return;}
        await redisClient.set(fields.address,1,15*60) //地址写入redis,有效期15分钟
        res.status(200).json({
            daoActor:await store.getDaoFromDid(fields.address), //dao帐号列表
            actor:await store.getActor(fields.address),  //个人帐号
            publicKey:req.app.get('publicKey')
        }); 
    } catch (e) {
        console.error(e);
        switch (e) {
            case ErrorTypes.EXPIRED_MESSAGE: {res.status(440).json({ errMsg: e.message });break;}
            case ErrorTypes.INVALID_SIGNATURE: {res.status(422).json({ errMsg: e.message });break;}
            default: {res.status(500).json({errMsg: e.message });break;}
        }
    }
});


/**
 * 获取登录信息
 */
router.get('/getUser', async function (req, res) {
    let did=req.headers.did
    let re=await redisClient.exists(did)
    if(re)
        res.status(200).json({
            daoActor:await store.getDaoFromDid(did), //dao帐号列表
            actor:await store.getActor(did), //个人帐号
            publicKey:req.app.get('publicKey')
        }); 
    else 
        res.status(404).json({errMsg: 'redis not exists'}); 
  });

  
/**
 * 获取dao及帐号信息
 */
router.post('/getAccountFromDaoid', async function (req, res) {
    try{
        res.status(200).json(await store.getAccountFromDaoid(req.body.daoid));
    }
    catch(err)
    {
        console.log('siwe.js post:/getAccountFromDaoid',err)
        res.status(500).json({errMsg: 'fail'});
    }  
  });

   
/**
 * 获取关注者
 */
router.post('/getDaoFollowers', async function (req, res) {
    try{
        res.status(200).json(await store.getDaoFollowers(req.body.daoid));
    }
    catch(err)
    {
        console.log('siwe.js post:/getDaoFollowers',err)
        res.status(500).json({errMsg: 'fail'});
    }  
  });


  

    
/**
 * 获取个人帐号信息
 */
router.post('/getMember', async function (req, res) {
    try{

      let reData= await store.getActor(req.body.did)
      reData['child']=await store.getDaoFromDid(req.body.did)
       res.status(200).json(reData)
    }
    catch(err)
    {
        console.log('siwe.js post:/getMember',err)
        res.status(500).json({errMsg: 'fail'});
    }  
  });



module.exports = router;
