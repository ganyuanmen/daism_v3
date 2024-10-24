import { getUser } from '../mysql/user'
import {getFollowers} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'
import { insertMessage } from '../mysql/message';


export function send(account,content,fileName,messageId,title,imgpath) 
{

  getUser('actor_account',account,'privkey,Lower(actor_account) account,actor_name,domain').then(localUser=>{
    try{
        if(!localUser.account) return;
        const thebody=createMessage(localUser.actor_name,localUser.domain,content,fileName,messageId,title,imgpath,process.env.LOCAL_DOMAIN);
        getFollowers({account:localUser.account}).then(data=>{
            data.forEach(element => {
                try{
                  if(element.user_inbox.startsWith(`https://${process.env.LOCAL_DOMAIN}`)){
                    insertMessage(messageId,element.user_account,`https://${process.env.LOCAL_DOMAIN}/communities/${messageId}`).then(()=>{})
                  }else {
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody,localUser.privkey);
                  }
                }catch(e1){ console.error(e1)}
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}


