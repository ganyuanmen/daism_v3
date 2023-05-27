'use strict';

// const { json } = require('body-parser');
// const upload = require('./upload.js');
const express = require('express')
const router = express.Router()
const store=require("../store")
const utils=require("../utils")
const activity=require("../activity")
const net=require("../net")
const multer  = require('multer');
const { v4: uuidv4 } = require("uuid");


// 定义文件保存路径和文件名
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function(req, file, cb) {
    if(!utils.httpValidate(req)) return 
    const fileName=uuidv4()
    let type = file.originalname.toLowerCase().split('.').splice(-1); 
    cb(null,fileName + '.' + type[0]);
  }
});

// const upload = multer({ dest: 'public/uploads/' });// 指定上传文件的保存目录
const upload = multer({ storage: storage });

// app.post('/api/upload', upload.single('image'), (req, res) => {
//   const file = req.file; // 获取上传的文件对象
//   const imageUrl = `/uploads/${file.filename}`; // 生成图片链接
//   res.status(200).json({ imageUrl }); // 返回图片链接给前端
// });

router.post('/upload',  upload.single('image'),async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(202).json({errMsg:'Invalid Signature'})
    const domain = req.app.get('domain');
    let fileName=req.file.filename;
    const imgPath=`https://${domain}/uploads/admin/${fileName}`
    res.status(200).json({ imgPath }); // 返回图片链接给前端
})

//dao帐号
router.post('/create', upload.single('image'), async function (req, res) {
   if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
  let {actorName,actorHomeUrl,actorDesc,daoid,did,fileType } = req.body;
  console.log(req.body)
  const domain = req.app.get('domain');
  let imgPath=''
  if(fileType) {
     // let fileName=utils.saveImg(selectImg,fileType,'admin')
      let fileName=req.file.filename;
      console.log(fileName)
      imgPath=`https://${domain}/uploads/admin/${fileName}`
  }
  
  if (!actorName || !daoid || !did) 
    return res.status(404).json({errMsg:'Bad request. Please make sure "actorName" is a property in the POST body.'});
  try{
    actorName=actorName.toLowerCase();
    //检查是否重名
    let account=await store.getUser('account',`${actorName}@${domain}`,'id,icon')  //id-->dao_id
    console.log(account)
    let localUser=await store.getUser('id',daoid,'id')  //id-->dao_id
    if(localUser['id']) { //修改
      if(account['id'] && account['id']!=daoid) //不是同一条修改记录, 重名
      {
        utils.deleteFile(req.file.filename,'public/uploads/admin')
        return res.status(202).json({errMsg: `duplication of name for ${actorName}`});
      }
      else {
        let dataLok=await store.updateUser(actorName,domain,actorHomeUrl,actorDesc,imgPath,daoid )
        if(!dataLok) return res.status(202).json({errMsg: `Data handle fail for ${actorName}`});
      }
    }else { //增加
      if(account['id']) //重名
      {
        utils.deleteFile(req.file.filename,'public/uploads/admin')
        return res.status(202).json({errMsg: `duplication of name for ${actorName}`});
      }
      else {
       let dataLok=await store.saveUser(actorName,domain,actorHomeUrl,actorDesc,imgPath,daoid)
       if(!dataLok) return res.status(202).json({errMsg: `Data handle fail for ${actorName}`});
      }
    }
    if(localUser.icon) utils.deleteFile(localUser.icon,'public/uploads/admin')
    res.status(200).json({
        daoActor:await store.getDaoFromDid(did), //dao帐号列表
        actor:await store.getActor(did),  //个人帐号
        publicKey:req.app.get('publicKey')
    }); 
  }
  catch(err)
  {
    console.log('admin.js post:/create',err)
    res.status(500).json({errMsg: 'fail'});
  }
});


//个人帐号
router.post('/updateActor', upload.single('image'), async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    const {actorName,actorDesc,did,fileType} = req.body;
    let imgPath=''
    if(fileType) {
       // let fileName=utils.saveImg(selectImg,fileType,'admin')
        let fileName=req.file.filename;
        let domain = req.app.get('domain');
        imgPath=`https://${domain}/uploads/admin/${fileName}`
    }
    if (!actorName || !did ) 
        return res.status(404).json({errMsg:'Bad request. Please make sure "actorName" is a property in the POST body.'});
    try{
        let old=store.getActor(did)
        if(old.member_icon) utils.deleteFile(old.member_icon,'public/uploads/admin')
        await store.updateActor(actorName,actorDesc,imgPath,did)
        res.status(200).json({
            daoActor:await store.getDaoFromDid(did), //dao帐号列表
            actor:await store.getActor(did),  //个人帐号
            publicKey:req.app.get('publicKey')
        }); 
    }
    catch(err)
    {
        console.log('admin.js post:/updateActor',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});


// 申请加入的dao列表
router.post('/getInviteDao', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        res.status(200).json(await store.getInviteDao(req.body.did));
    }
    catch(err)
    {
        console.log('admin.js post:/getInviteDao',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});


// 待审核的申请列表
router.post('/getVerifyDao', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        res.status(200).json(await store.getVerifyDao(req.body.did));
    }
    catch(err)
    {
        console.log('admin.js post:/getVerifyDao',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});


// Dao 成员列表
router.post('/getDaoMembers', async function (req, res) {
    //if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        res.status(200).json(await store.getDaoMembers(req.body.daoid));
    }
    catch(err)
    {
        console.log('admin.js post:/getDaoMembers',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});



// Dao 成员列表
router.post('/getHomeData', async function (req, res) {
    // if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
        res.status(200).json(await store.getHomeData(req.body.daoid));
    }
    catch(err)
    {
        console.log('admin.js post:/getHomeData',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});

// 申请加入
router.post('/inviteAdd', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
       const {did,daoid,submitInfo}=req.body
       await store.inviteAdd(did,daoid,submitInfo)
       res.status(200).json(await store.getInviteDao(did));
    }
    catch(err)
    {
        console.log('admin.js post:/invitAdd',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});

// 撤回申请
router.post('/delInvite', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
       await store.delInvite(req.body.id)
       res.status(200).json(await store.getInviteDao(req.body.did));
    }
    catch(err)
    {
        console.log('admin.js post:/delInvite',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});


// 审核处理
router.post('/approve', async function (req, res) {
    if(!utils.httpValidate(req)) return res.status(406).json({errMsg:'Invalid Signature'})
    try{
       await store.approve(req.body.id,req.body.flag)
       res.status(200).json({msg: 'ok'});
    }
    catch(err)
    {
        console.log('admin.js post:/approve',err)
        res.status(500).json({errMsg: 'fail'});
    }  
});


//关注
router.post('/follow', async function (req, res) {
  // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
  console.log("admin.js post:/follow")
  // console.log(req.body)
  const {name,domain,actorInbox,actorUrl,account}=req.body;
  // let re=await store.getFollowee(account,`${name}@${domain}`,'id')
  // if(re['id']) {
  //   res.status(200).send('already follow:'+account);
  //   return;
  // }


  let thebody=activity.createFollow(name,domain,actorUrl,new Date().getTime());
  // console.log("---------------------------------------------------")
  // console.log(thebody)
  // console.log("---------------------------------------------------")
  let localUser=await store.getUser('account',`${name}@${domain}`,'privkey')
  console.log(localUser)
  if(!localUser.privkey) return res.status(404).send( `No record found for ${name}@${domain}.`);
  net.signAndSend(actorInbox,name,domain,thebody,localUser.privkey);
  //actorInbox 对方收件箱地址
  //name 本方名称
  //domain  本方域名
  //privkey 本方反钥
  res.status(200).end();
});


// //创建message
// router.post('/createMessage', async function (req, res) {
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   console.log("admin.js post:/createMessage")
//    console.log(req.body)
//    if(!req.body.content) return
//   const {name,domain,content}=req.body
//   let thebody=activity.createMessage(name,domain,content);
//   let user=await utils.getLocalInboxFromAccount(`${name}@${domain}`)

//   let lok=await store.saveMessage(user,thebody.object.id,content,`https://${domain}/u/${name}/follower`,'Note',req.body.title?req.body.title:'',req.body.pid?req.body.pid:0)
//   console.log('saveMessage',lok)
//   let data=await store.getFollowers(`${name}@${domain}`,true)
//   const localUser=await store.getUser('account',`${name}@${domain}`,'privkey')
//   data.forEach(element => {
//     console.log(element.actor_inbox)
//     net.signAndSend(element.actor_inbox,name,domain,thebody,localUser.privkey);
//   });
//   res.status(200).send('sendMessage ok').end();
// });


// //取消关注
// router.post('/unFollow', async function (req, res) {
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   console.log("admin.js post:/unFollow")
//   // console.log(req.body)
//   const {name,domain,actorUrl,actorInbox,followId}=req.body
//   let thebody=activity.createUndo(name,domain,actorUrl,followId);
//   let localUser=await store.getUser('account',`${name}@${domain}`,'privkey')
//   if(!localUser.privkey) return res.status(404).json({msg: `No record found for ${name}@${domain}.`});
//   net.signAndSend(actorInbox,name,domain,thebody,localUser.privkey);
//   let lok=await store.removeFollow(followId)
//   console.log(lok)
//   res.status(200).end();
// });





// //获取followee
// router.get('/getFollowee', async function (req, res) {
//   console.log("/api/admin/getFollowee:",req.headers.actor)
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   let actor=req.headers.actor;
//   let re=await store.getFollowees(actor);
//   res.status(200).json(re)
// });


// //获取follower
// router.get('/getFollower', async function (req, res) {
//   console.log("/api/admin/getFollower:",req.headers.actor)
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   let actor=req.headers.actor;
//   let re=await store.getFollowers(actor);
//   res.status(200).json(re)
// });


// //getMessage
// router.post('/getMessage', async function (req, res) {
//   console.log("/api/admin/getMessage:",req.body.actor)
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   let re=await store.getMessages(req.body.actor);
//   res.status(200).json(re)
// });


//获取参与者
router.get('/getActor', async function (req, res) {
  console.log("/api/admin/getActor:",req.headers.account)
  // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
  let account=req.headers.account;
  console.log(account)
  let actor
  if(account.startsWith('http'))  actor=await utils.getInboxFromUrl(account);
  else actor=await utils.getInboxFromAccount(account)
  res.status(200).json(actor)
});

// //获取个人信息
// router.get('/getUser', async function (req, res) {
//   console.log("/api/admin/getUser:",req.headers.did)
//   // if(!utils.httpValidate(req)) return res.status(422).send('Invalid Signature')
//   let did=req.headers.did 
//   if(!did) return  res.status(401).send('require did')
//   let localUser=await store.getUser('did',did,'account')
//   if(localUser['account']) return res.status(200).send(localUser['account'])
//   res.status(404).send(`not found for did ${did}`)
// });


// //获取个人信息
// router.get('/getMessageFromId', async function (req, res) {
//   console.log("/api/admin/getMessageFromId:",req.headers.messageid)
//   let re=await store.getMessageFromId(req.headers.messageid)
//   res.status(200).json(re)
// });

// 上传图片接口
router.post('/uploadImage', (req, res) => {
  upload(req, res).then(imgsrc => {
    // 上传成功 存储文件路径 到数据库中

    // swq sql需要修改一下，变成新增，这里测试暂用更新
    let sql = `UPDATE account SET imgsrc='${imgsrc}'WHERE id='1' `
    query(sql, (err, results) => {
      if (err) {
        formatErrorMessage(res, err)
      } else {
        res.send({
          "code": "ok",
          "message": "上传成功",
          'data': {
            url: imgsrc
          }
        })
      }
    })
  }).catch(err => {
    formatErrorMessage(res, err.error)
  })
})

// 格式化错误信息
function formatErrorMessage(res, message,) {
  res.status(500).send({
    "code": "error",
    "message": message || '',
  });
}

module.exports = router;
