import { getUser } from '../mysql/user'
import {getFollowers} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'
import { insertMessage } from '../mysql/message';

//id 增加后的自增ID
export function send(account,textContent,content,fileName,message_id,title,imgpath,pathtype) 
{

  getUser('actor_account',account,'privkey,Lower(actor_account) account,actor_name,domain').then(localUser=>{
    try{
        if(!localUser.account) return;
        const thebody1=createMessage(localUser.actor_name,localUser.domain,content,fileName,message_id,title,imgpath,process.env.LOCAL_DOMAIN,pathtype);
        const thebody2=createMessage(localUser.actor_name,localUser.domain,'',fileName,message_id,`${title} ${textContent}`,imgpath,process.env.LOCAL_DOMAIN,pathtype);
        
        getFollowers({account:localUser.account}).then(data=>{
            data.forEach(element => {
                try{
                  if(element.user_inbox.startsWith(`https://${process.env.LOCAL_DOMAIN}`)){
                    insertMessage(element.user_account,message_id,pathtype).then(()=>{})
                  }else {
                    if(element.user_inbox.includes('/api/activitepub/inbox')) //enki
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody1,localUser.privkey);
                    else //非enki
                    signAndSend(element.user_inbox,localUser.actor_name,localUser.domain,thebody2,localUser.privkey);
                  }
                }catch(e1){ console.error(e1)}
            });
        })
      }catch(e){
        console.error(e)
    }
    }) 
}

