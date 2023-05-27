'use strict';

const store = require('../store');

const express = require('express'),activity=require("../activity"),
      router = express.Router();

router.get('/:name/:guid',async function (req, res) {
  console.log("message.js get:/guid")
  let guid = req.params.guid;
  let name=req.params.name;
  let domain = req.app.get('domain');

  if (!guid || !name) {
    return res.status(400).send('Bad request.');
  }
  else {
    let messObj=await store.getMessage(`https://${domain}/m/${name}/${guid}`)
    let thebody=activity.createMessage(name,domain,messObj['content']);
    res.json(thebody)
  }
});

module.exports = router;
