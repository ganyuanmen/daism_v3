const actor=require('./actor');
const validator=require("./validators")
const Base64=require("./Base64")
const store=require('../store')
const activity=require('../activity')
const net=require("../net")
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const parentPath = path.resolve(__dirname, '..');

function send(daoid,content,fileName,path,messageId,title)  //daoid,content,fileName,'news'
{
 
    store.getUser('id',daoid,'privkey,account').then(localUser=>{
    try{
        if(!localUser.account) return;
        let strs=localUser.account.split('@') //strs[0]->name strs[1]->domain
        const thebody=activity.createMessage(strs[0],strs[1],content,fileName,path,messageId,title);
        store.getFollowers(localUser.account).then(data=>{
            data.forEach(element => {
                console.log(element.actor_inbox)
                try{
                    net.signAndSend(element.actor_inbox,strs[0],strs[1],thebody,localUser.privkey);
                }catch(e1){ console.error(e1)}
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}

function saveImg(imgStr,fileType,path) //path->news,discussions,events
{
  console.log(imgStr)
  try{
    const base64 = imgStr.replace(/^data:image\/.+;base64,/,"")
    const buffer = Buffer.from(base64, 'base64');
    const fileName=uuidv4()+'.'+fileType
    fs.writeFile(`${parentPath}/public/uploads/${path}/${fileName}`, buffer, (err) => {
        if (err) console.error('Image file save fail', err);
        else console.log('Image file save success');
    });
        
    return fileName

  }catch(e){
    console.error('saveImg fail', err);
    return ''
  }

}

function deleteFile(field,path)
{
	let type =field.split('/').splice(-1); 
	fs.unlink(`${path}/${type[0]}`, (err) => {
	  if (err) console.error('delete file error:', err);
	});
}

  module.exports = {
    getInboxFromAccount: actor.getInboxFromAccount,
    getInboxFromUrl:actor.getInboxFromUrl,
    validateSingnature:validator.validateSingnature,
    httpValidate:validator.httpValidate,
    Base64,
    getLocalInboxFromAccount:actor.getLocalInboxFromAccount,
    getLocalInboxFromUrl:actor.getLocalInboxFromUrl,
    send,saveImg,deleteFile
  };