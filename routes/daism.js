
const utils=require("../utils")
const express = require('express')
const daism=require("../store/daism")
const router = express.Router()

router.post('/getDaismData', async function (req, res) {

    try{
        res.status(200).json(await daism[req.headers.method](req.body));
    }
    catch(err)
    {
        console.log('daism.js post:/getDaismData:'+req.headers.method,err)
        return res.status(500).json({errMsg: 'fail'});
    }  
});

router.post('/handleDaism', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
       let lok=await daism[req.headers.method](req.body)
       if(lok) res.status(200).json({msg:'handle ok',result:lok})
       else res.status(202).json({errMsg:'handle fail!'})
    }
    catch(err)
    {
        console.log('daism.js post:/handleDaism',err)
        res.status(500).json({errMsg: 'fail',err});
    }  
});

module.exports = router;
