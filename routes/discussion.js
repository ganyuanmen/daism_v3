
const utils=require("../utils")
const express = require('express')
const discussion=require("../store/discussion")
const router = express.Router()

router.post('/add',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {daoid,did,title,content,isSend,isDiscussion,id}=req.body
    try{
        let insertId
        if(id && id!=='undefined') //w修改
        {
          await discussion.edit(id,title,content,isSend)
          insertId=id
        }
        else  //增加
        {
            insertId= await discussion.add(daoid,did,title,content,isSend,isDiscussion)
        }
        if(insertId) {
            if(isSend=='1') utils.send(daoid,content,'','discussions',insertId,title)   
            res.status(200).json({msg:'add ok',id:insertId});
        }
        else 
            res.status(202).json({errMsg: 'fail'});
    }
    catch(err)
    {
        console.log('discussion.js post:/add',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


router.post('/reply',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {did,content,id}=req.body
    try{
       
        let re= await discussion.addCommont(id,did,content)
        if(re) {
            res.status(200).json({msg:'add ok',id:id});
        }
        else 
            res.status(202).json({errMsg: 'fail'});
    }
    catch(err)
    {
        console.log('discussion.js post:/reply',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


router.post('/del',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,replyLevel}=req.body
    try{
        await discussion.del(id,replyLevel)
        res.status(200).json({msg:'del ok'});
    }
    catch(err)
    {
        console.log('discussion.js post:/del',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})



router.post('/edit',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,title}=req.body
    try{
      
        await discussion.edit(id,title)
        res.status(200).json({msg:'edit ok'});
    }
    catch(err)
    {
        console.log('discussion.js post:/edit',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


router.post('/editDiscussion',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,flag}=req.body
    try{
      
        await discussion.editDiscussion(id,flag)
        res.status(200).json({msg:'editDiscussion ok'});
    }
    catch(err)
    {
        console.log('discussion.js post:/editDiscussion',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


//一条讨论
router.post('/getOne', async function (req, res) {
  //  if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    let reData=[]
    try{
       reData=await discussion.getOne(req.body.id);
       if(reData.length && reData[0].id)
            reData[0].child=await discussion.getFromPid(reData[0].id)
    }
    catch(err)
    {
        console.log('discussion.js post:/getOne',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
    res.status(200).json(reData);
});


//分页数据
router.post('/getData', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {ps,pi,daoid}=req.body
    try{
        res.status(200).json(await discussion.getData(ps,pi,daoid));
    }
    catch(err)
    {
        console.log('discussion.js post:/getData',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});

module.exports = router;
