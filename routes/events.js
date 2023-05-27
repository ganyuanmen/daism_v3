
const utils=require("../utils")
const express = require('express')
const events=require("../store/events")
// const activity=require("../activity")
// const net=require("../net");
const router = express.Router()

const multer  = require('multer');
const { v4: uuidv4 } = require("uuid");


// 定义文件保存路径和文件名
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/uploads/events');
    },
    filename: function(req, file, cb) {
      const fileName=uuidv4()
      let type = file.originalname.toLowerCase().split('.').splice(-1); 
      console.log(type[0])
      cb(null,fileName + '.' + type[0]);
    }
  });

const upload = multer({ storage: storage });


router.post('/add', upload.single('image'),async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {daoid,did,title,content,isSend,isDiscussion,topImg,startTime,endTime,eventUrl,original,numbers,participate,address,id,fileType}=req.body
    let imgPath='',fileName=''
    if(fileType) {
       // fileName=utils.saveImg(topImg,fileType,'events')
        let fileName=req.file.filename;
        let domain = req.app.get('domain');
        imgPath=`https://${domain}/uploads/events/${fileName}`
    }
    try{
        let insertId
        if(id && id!=='undefined') //w修改
        {
         
          let old=await events.getOne(id)
          if(old[0].top_img) utils.deleteFile(old[0].top_img,'public/uploads/events')
          await events.edit(id,title,content,isSend,isDiscussion,imgPath,startTime,endTime,eventUrl,original,numbers,participate,address)
          insertId=id
        }
        else  //增加
        {
            insertId= await events.add(daoid,did,title,content,isSend,isDiscussion,imgPath,startTime,endTime,eventUrl,original,numbers,participate,address)
            if(isSend=='1') utils.send(daoid,content,fileName,'events',insertId,title)   
        }
        if(insertId) res.status(200).json({msg:'handle ok',id:insertId});
        else  res.status(202).json({errMsg: 'fail'});
    }
    catch(err)
    {
        console.log('events.js post:/add',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})

router.post('/reply',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {daoid,did,content,id}=req.body
    try{
        let cid=new Date().getTime()
        let re= await events.add(cid,id,daoid,did,'',content,1,1)
        if(re) {
            res.status(200).json({msg:'add ok',pid:id});
        }
        else 
            res.status(202).json({errMsg: 'fail'});
    }
    catch(err)
    {
        console.log('events.js post:/reply',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})

router.post('/del',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,replyLevel}=req.body
    try{
        let old=events.getOne(id)
        if(old.top_img) utils.deleteFile(old.top_img,'public/uploads/events')
        await events.del(id,replyLevel)
        res.status(200).json({msg:'del ok'});
    }
    catch(err)
    {
        console.log('events.js post:/del',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})

//修改是否允许评论
router.post('/editDiscussion',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,flag}=req.body
    try{
      
        await events.editDiscussion(id,flag)
        res.status(200).json({msg:'editDiscussion ok'});
    }
    catch(err)
    {
        console.log('events.js post:/editDiscussion',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


//修改是否允许回复
router.post('/editReply',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {id,flag}=req.body
    try{
      
        await events.editReply(id,flag)
        res.status(200).json({msg:'editDiscussion ok'});
    }
    catch(err)
    {
        console.log('events.js post:/editDiscussion',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})



//一条讨论
router.post('/getOne', async function (req, res) {
    //  if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    let reData=[]
    try{
       reData=await events.getOne(req.body.id);
       if(reData.length && reData[0].id)
       {
            reData[0].statInfo=await events.eventsSum(req.body.id)
            reData[0].child=await events.getFromPid(reData[0].id)
            const record=reData[0].child
            if(record.length)
            {
                for(let i=0;i<record.length;i++)
                {
                    let pid=record[i]['id']
                    let child=await events.geRely(pid)
                    record[i]['child']=child
                }
            }
       }
    }
    catch(err)
    {
        console.log('events.js post:/getOne',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
    res.status(200).json(reData);
});


//获参与者
router.post('/getJion', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
      const reData=await events.getJoin(req.body.id)
      res.status(200).json(reData);
    }
    catch(err)
    {
        console.log('events.js post:/getJion',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
   
});


//增加参与者
router.post('/addJoin', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        const {pid,did,content}=req.body
        await events.addJoin(pid,did,content)
        res.status(200).json({msg:'addJoin ok'});
    }
    catch(err)
    {
        console.log('events.js post:/addJoin',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
   
});


//通过参与
router.post('/updateVerify', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        await events.updateVerify(req.body.id,1)
        res.status(200).json({msg:'updateVerify ok'});
    }
    catch(err)
    {
        console.log('events.js post:/updateVerify',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
});

//拒绝参与
router.post('/updateReject', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        await events.updateVerify(req.body.id,3)
        res.status(200).json({msg:'updateReject ok'});
    }
    catch(err)
    {
        console.log('events.js post:/updateReject',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
});


//增加评论
router.post('/addComment', async function (req, res) {
  if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
  try{
      const {pid,did,content}=req.body
      await events.addComment(pid,did,content)
      res.status(200).json({msg:'addComment ok'});
  }
  catch(err)
  {
      console.log('events.js post:/addComment',err)
      return res.status(500).json({errMsg: 'fail'});
  }  
 
});


//增加回复
router.post('/addReply', async function (req, res) {
     if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
   try{
       const {pid,did,nick,icon,content}=req.body
       await events.addReply(pid,did,nick,icon,content)
       res.status(200).json({msg:'addReply ok'});
   }
   catch(err)
   {
       console.log('events.js post:/addReply',err)
       return res.status(500).json({errMsg: 'fail'});
   }  
  
 });



//删除参与者
router.post('/delJoin', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
  try{
     
      await events.delJoin(req.body.id)
      res.status(200).json({msg:'delJoin ok'});
  }
  catch(err)
  {
      console.log('events.js post:/delJoin',err)
      return res.status(500).json({errMsg: 'fail'});
  }  
 
});

//分页数据
router.post('/getData', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {ps,pi,daoid}=req.body
    try{
        res.status(200).json(await events.getData(ps,pi,daoid));
    }
    catch(err)
    {
        console.log('events.js post:/getData',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});

module.exports = router;
