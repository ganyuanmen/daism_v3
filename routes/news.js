
const utils=require("../utils")
const express = require('express')
const news=require("../store/news")
const router = express.Router()
const multer  = require('multer');
const { v4: uuidv4 } = require("uuid");


// 定义文件保存路径和文件名
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/uploads/news');
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
    const {daoid,did,title,content,id,fileType}=req.body
    
    let imgPath='',fileName=''
    if(fileType) {
       // fileName=utils.saveImg(topImg,fileType,'news')
        let fileName=req.file.filename;
        let domain = req.app.get('domain');
        imgPath=`https://${domain}/uploads/news/${fileName}`
    }
    try{
        let insertId
        if(id && id!=='undefined') //w修改
        {
          let old=await news.getOne(id)
          if(old[0].top_img){
            utils.deleteFile(old[0].top_img,'public/uploads/news')
        }
          await news.edit(title,imgPath,content,id)
          insertId=id
        }
        else  //增加
        {
            insertId= await news.add(imgPath,daoid,did,title,content)
            utils.send(daoid,content,fileName,'news',insertId,title)
        }
        if(insertId) res.status(200).json({msg:'handle ok',id:insertId});
        else res.status(202).json({errMsg: 'fail'});
    }
    catch(err)
    {
        console.log('news.js post:/add',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})


router.post('/del',async (req,res)=>{
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        let old=news.getOne(id)
        if(old.top_img) utils.deleteFile(old.top_img,'public/uploads/news')
        await news.del(req.body.id)
        res.status(200).json({msg:'del ok'});
    }
    catch(err)
    {
        console.log('news.js post:/del',err)
        res.status(500).json({errMsg: 'fail'});
    }  
})



// router.post('/edit',async (req,res)=>{
//     if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
//     const {title,topImg,content,id}=req.body
//     try{
      
//         await news.edit(title,topImg,content,id)
//         res.status(200).json({msg:'edit ok'});
//     }
//     catch(err)
//     {
//         console.log('news.js post:/edit',err)
//         res.status(500).json({errMsg: 'fail'});
//     }  
// })

router.post('/getOne', async function (req, res) {
    try{
        res.status(200).json(await news.getOne(req.body.id));
    }
    catch(err)
    {
        console.log('news.js post:/getOne',err)
        return res.status(500).json({errMsg: 'fail'});
    }  
    
});


//分页数据
router.post('/getData', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {ps,pi,daoid}=req.body
    try{
        res.status(200).json(await news.getData(ps,pi,daoid));
    }
    catch(err)
    {
        console.log('news.js post:/getData',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});

module.exports = router;
