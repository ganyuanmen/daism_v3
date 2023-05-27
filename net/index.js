const request = require('request'),crypto = require('crypto');

async function signAndSend(url,name,domain,message,privkey) {
    console.log("signAndSend--->",[url,name,domain,message])
    const myURL = new URL(url);
    let targetDomain = myURL.hostname;
    let inboxFragment = url.replace('https://'+targetDomain,'');
    const digestHash = crypto.createHash('rsa-sha256').update(JSON.stringify(message)).digest('base64');
    const signer = crypto.createSign('rsa-sha256');
    let d = new Date();
    let stringToSign = `(request-target): post ${inboxFragment}\nhost: ${targetDomain}\ndate: ${d.toUTCString()}\ndigest: SHA-256=${digestHash}\ncontent-type: application/activity+json`;
    // console.log("---------ooooooooooooooooooooo----------------------------------------")
    // console.log(stringToSign)
    // console.log("---------oooooooooooooooooooooooo----------------------------------------")
    
    signer.update(stringToSign);
    signer.end();
    const signature = signer.sign(privkey);
    const signature_b64 = signature.toString('base64');
    let header = `keyId="https://${domain}/u/${name}",algorithm="rsa-sha256",headers="(request-target) host date digest content-type",signature="${signature_b64}"`;
    
    request({
    url,
    headers: {
        'Host': targetDomain,
        'Date': d.toUTCString(),
        'Digest': `SHA-256=${digestHash}`,
        'Signature': header,
        //,signingString:strToBase64,
        'content-type': 'application/activity+json'

    },
    method: 'POST',
    json: true,
    body: message
    }, function (error, response){
    if (error) {
        console.log('Error:', error,(response&&response.body)?response.body:'');
    }
    else {
        console.log('Response:', (response&&response.statusCode)?response.statusCode:0,(response&&response.body)?response.body:'');
    }
    });
}
  
  function get(url, headers={},method='GET') {
    console.log([url,headers,method])
    return new Promise(function (resolve, reject) { request({url,headers,method,json: true}, 
        function (error, response){
        if (error) {
          console.log('Error:', error, (response&&response.body)?response.body:'');
          resolve({code:(response&&response.statusCode)?response.statusCode:500});
        }
        else 
        resolve({code:response.statusCode,message:response.body});
         // res.status(200).json();
      });});
  }

 
  module.exports = {signAndSend,get};