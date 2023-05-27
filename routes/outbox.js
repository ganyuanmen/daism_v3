// 'use strict';
// const express = require('express'),
//       crypto = require('crypto'),
//       request = require('request'),
//       router = express.Router();

// function signAndSend(message, domain, req, res, targetDomain) { 
//   console.log("-------------outbox sendmessage--------")
//   console.log([message, domain,targetDomain])
//   // get the URI of the actor object and append 'inbox' to it
//   let inbox = message.object+'/inbox';
//   let name = req.body.actor.replace(`https://${domain}/u/`,'');
//   //console.log(inbox+"------------>")
//   let inboxFragment = inbox.replace('https://'+targetDomain,'');
  
//   // get the private key
//   let db = req.app.get('db');
//   let result = db.prepare('select privkey from accounts where name = ?').get(`${name}@${domain}`);
//   if (result === undefined) {
//     return res.status(404).send(`No record found for ${name}.`);
//   }
//   else {
//     let privkey = result.privkey;
//     const digestHash = crypto.createHash('sha256').update(JSON.stringify(message)).digest('base64');
//     const signer = crypto.createSign('sha256');
//     let d = new Date();
//     let stringToSign = `(request-target): post ${inboxFragment}\nhost: ${targetDomain}\ndate: ${d.toUTCString()}\ndigest: SHA-256=${digestHash}`;
//     signer.update(stringToSign);
//     signer.end();
//     const signature = signer.sign(privkey);
//     const signature_b64 = signature.toString('base64');
//     let header = `keyId="https://${domain}/u/${name}",headers="(request-target) host date digest",signature="${signature_b64}"`;
 
   
//     request({
//       url: inbox,
//       headers: {
//         'Host': targetDomain,
//         'Date': d.toUTCString(),
//         'Digest': `SHA-256=${digestHash}`,
//         'Signature': header
//       },
//       method: 'POST',
//       json: true,
//       body: message
//     }, function (error, response){
//         console.log("--------------->>>>>>>>>>>>>>>>>----------------------")
//       if (error) {
//         console.log('Error:', error, response.body);
//       }
//       else {
//         console.log('Response:', response.body);
//       }
//     });
//     return res.status(200);
//   }
// }


// router.post('/', function (req, res) {
//   console.log("outbox.js post:/")
//   console.log("--------outbox---------------")
//   console.log(req.body)
//   console.log("-------outbox-------------------")
//   // pass in a name for an account, if the account doesn't exist, create it!
//   let domain = req.app.get('domain');
//   const myURL = new URL(req.body.object);
//   let targetDomain = myURL.hostname;

//   signAndSend(req.body, domain, req, res, targetDomain);
   
  
// });

// module.exports = router;
