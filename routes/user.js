'use strict';
const express = require('express'),
      utils=require('../utils'),
      net=require("../net"),
      store=require("../store"),
      activity=require("../activity"),
      // crypto = require('crypto'),
      router = express.Router();
      

      

router.post('/:name/inbox',async function (req, res) {
  console.log("user.js post:/:name/inbox")
  console.log("---------receive--------------")
  console.log(req.body)
  console.log("--------------------------")
  const domain = req.app.get('domain');
  const name = req.params.name;

  switch (req.body.type.toLowerCase()) {
    case 'accept': 
         accept(req).then(e=>{console.log(e)})
         break;
    case 'reject':break;
    case 'undo':  
        undo(req).then(e=>{console.log(e)}); 
        break;
    case 'block':break;
    case 'create': 
        // createMess(req).then(e=>{console.log(e)});
         break;
    case 'delete': break;
    case 'like':break;
    case 'update':break;
    case 'add':break;
    case 'remove': break;
    case 'follow': 
          follow(req,name,domain).then(e=>{console.log(e)});
    break;
  }

  if(req.body.type.toLowerCase()==='create')
  {
    console.log("404------------------")
    // res.status(404).end();
    return res.status(403).json({ message: 'refuse connect' });
  }
  else
  {
    res.status(202).json({msg: 'ok'});
  }
  return;
});

async function undo(req)
{
  if(!req.body.object || !req.body.object.id) return 'activity error!';
  await store.removeFollow(req.body.object.id)
  return 'undo handle ok'
}

async function accept(req)
{
  let actor=await utils.getInboxFromUrl(req.body.actor); 
  let user=await utils.getLocalInboxFromUrl(req.body.object.actor);
  let re= await store.saveFollow(actor,user,req.body.object.id,0)  //关注他人的确认
  return "accept handle ok"
}

async function createMess(req)
{
  let actor=await utils.getInboxFromUrl(req.body.actor);
  let followerUrl=req.body.cc[0];
  let messageType=req.body.object.type;
  let messageId=req.body.object.id;
  let content=req.body.object.content;
  let lok=await store.saveMessage(actor,messageId,content,followerUrl,messageType)
  return 'createMess handle ok';     
}

async function follow(req,name,domain)
{
  let actor=await utils.getInboxFromUrl(req.body.actor);
  console.log(actor)
  let user=await utils.getLocalInboxFromUrl(req.body.object)
  console.log(user)
  console.log([name,domain])
  if(!actor.inbox) return  `no found for ${req.body.actor}`;
  if(user.name!==name || user.domain!==domain) return 'activity error ';
  let thebody=activity.createAccept(req.body,name,domain);
  let follow=await store.getFollower(actor.account,user.account,'id');
  let localUser=await store.getUser('account',user.account,'privkey,id')
  if(follow['id']) { 
    console.log("已关注"); //已关注
    net.signAndSend(actor.inbox,name,domain,thebody,localUser.privkey);
  } 
  else
  {
    let lok=await store.saveFollow(actor,user,req.body.id,1,localUser['id']);// 被他人关注 localUser['id']-->daoId
    if(lok)
    {
      console.log("follow save is ok")
      net.signAndSend(actor.inbox,name,domain,thebody,localUser.privkey);
    }  
    else  
      return 'server handle error';
  }
  return 'follow handle ok!'
}

router.get('/:name', async function (req, res) {
  console.log('user.js get:/:name')
  let name = req.params.name;
  let domain = req.app.get('domain');
  if (!name) {return res.status(400).send('Bad request.');}
  else {
    let localUser = await store.getUser('account',`${name}@${domain}`,'account,pubkey,icon')
    if (!localUser['account']) {
      return res.status(404).send(`No record found for ${name}.`);
    }
    else {
      res.json(activity.createActor(name,domain,localUser));
    }
  }
});

router.get('/:name/followers',async function (req, res) {
  console.log('user.js get:/:name/followers')
  let name = req.params.name;
  if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
  else {
    let domain = req.app.get('domain');
    let followers =await store.getFollowers(`${name}@${domain}`)
    let followersCollection = activity.createFollowers(name,domain,followers)
    res.json(followersCollection);
  }
});


router.get('/:name/following',async function (req, res) {
  console.log('user.js get:/:name/following')
  let name = req.params.name;
  if (!name) {return res.status(400).json({errMsg:'Bad request.'});}
  else {
    let domain = req.app.get('domain');
    let followees =await store.getFollowees(`${name}@${domain}`)
    let followersCollection = activity.createFollowees(name,domain,followees)
    res.json(followersCollection);
  }
});

module.exports = router;
