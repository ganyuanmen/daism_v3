
const httpSignature = require('http-signature');
const actorGenerate=require("./actor")
const NodeRSA  = require ('node-rsa');
const base64=require("./Base64")
/**
 * 验证其它federation发送请求的的身份
 * @param {*} req 
 * @param {*} actorurl 
 * @returns 
 */
async function validateSingnature(req,actorurl)
{
     let sigHead= httpSignature.parse(req);
     if(!sigHead)  return {state:false,msg: 'Unsupported signature algorithm (only rsa-sha256 are supported)'};
     let actor=await actorGenerate.getInboxFromUrl(actorurl);
     console.log(`actor for url:${actorurl}`,actor)
     if(!actor.inbox)  return {state:false,msg: 'get public key error!'};
     sigHead.params.signature=Buffer.from(sigHead.params.signature,'base64');
     console.log("---------signingString----------------------------------------")
     console.log(sigHead.signingString)
     console.log("---------signingString----------------------------------------")
     sigHead.signingString=sigHead.signingString.replace(' post ',' post /u')
     return{state:httpSignature.verifySignature(sigHead, actor['pubkey']),msg:'check end'}
}

/**
 * 本服务http请求签名认证
 * @param {*} req 
 */
function httpValidate(req)
{
     try{
          const {signature,base64text,origin}=req.headers
          if(!signature || !base64text) return false;
          let privateKey = req.app.get('privateKey');
          const RSAObj = new NodeRSA(privateKey);
          RSAObj.setOptions({encryptionScheme: 'pkcs1'}); // jsencrypt自身使用的是pkcs1加密方案, 
          let decryptText=RSAObj.decrypt(signature, 'utf8')
          // console.log("-------------------------")
          // console.log(base64text)
          // console.log(decryptText)
          // console.log("-------------------------")
          if(decryptText!==base64text) return false
          //const base64=new Base64()
          const orignText=base64.decode(base64text)
          const obj=JSON.parse(orignText)
          if(origin!==obj['origin']) return false
          return true
     }catch(err){
          console.log(err)
          return false
     }
}

module.exports = {
    validateSingnature,httpValidate

  };