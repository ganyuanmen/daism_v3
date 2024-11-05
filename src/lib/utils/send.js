import { getUser } from '../mysql/user'
import {getFollowers} from '../mysql/folllow'
import {signAndSend} from '../net'
import {createMessage} from '../activity/createMessage'
import { insertMessage } from '../mysql/message';

//id 增加后的自增ID
export function send(account,content,fileName,id,title,imgpath,pathtype) 
{

  getUser('actor_account',account,'privkey,Lower(actor_account) account,actor_name,domain').then(localUser=>{
    try{
        if(!localUser.account) return;
        const thebody=createMessage(localUser.actor_name,localUser.domain,content,fileName,id,title,imgpath,process.env.LOCAL_DOMAIN,pathtype);
        getFollowers({account:localUser.account}).then(data=>{
            data.forEach(element => {
                try{
                  if(element.user_inbox.startsWith(`https://${process.env.LOCAL_DOMAIN}`)){
                    insertMessage(id,element.user_account,`https://${process.env.LOCAL_DOMAIN}/communities/${pathtype}/${id}`,pathtype).then(()=>{})
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


