'use strict';
const express = require('express'),
      store=require("../store"),
      activity=require("../activity"),
      router = express.Router();

router.get('/', async function (req, res) {
  console.log("webfinfer.js get:/")
  let resource = req.query.resource;
  
  if (!resource || !resource.includes('@') || !resource.toLowerCase().startsWith('acct:')) {
    return res.status(400).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
  }
  else {
    
    let strs = resource.replace('acct:','').toLowerCase().split('@');
    let user = await store.getUser('account',resource.replace('acct:','').toLowerCase(),'account')
    if (!user.account) {
      return res.status(404).send(`No record found for ${strs[0]}@${strs[1]}.`);
    }
    else {
      let aa=activity.createWebfinger(strs[0],strs[1])
      // console.log(aa)
      res.status(200).json(aa);
    }
  }
});

module.exports = router;
