const net=require('../net')
const store=require('../store')

  async function getLocalInboxFromUrl(url)
  {
    let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',icon:''}
    let user=await store.getUser('account_url',url,'account,icon,pubkey');
    if(!user['account']) return obj;
    let names=user.account.split('@');
    return {name:names[0],domain:names[1],inbox:`https://${names[1]}/u/${names[0]}/inbox`,account:user['account'],url,pubkey:user['pubkey'],icon:user['icon']}
  }

  async function getLocalInboxFromAccount(account) {
    let obj={name:'',domain:'',inbox:'',account:'',url:'',pubkey:'',icon:''}
    let user=await store.getUser('account',account,'account_url,icon,pubkey');
    if(!user['account_url']) return obj;
    let names=account.split('@');
    return {name:names[0],domain:names[1],inbox:`https://${names[1]}/u/${names[0]}/inbox`,account,url:user['account_url'],pubkey:user['pubkey'],icon:user['icon']}
  }

  async function getInboxFromUrl(url,type='application/activity+json')
  {
    // console.log('getInboxFromUrl url:'+url)
    // console.log('getInboxFromUrl type:'+type)
    const myURL = new URL(url);
    let obj={name:'',domain:myURL.hostname,inbox:'',account:'',url:'',pubkey:'',icon:''}
    let re= await net.get(url,{"Content-Type": type})
    console.log(re)
    if(re.code!==200) return obj;
    re=re.message
    if(!re) return obj;
    if(re.name) obj.name=re.name;
    if(re.inbox) { 
      obj.inbox=re.inbox; 
      obj.pubkey=re.publicKey.publicKeyPem;
      obj.url=re.id;
      obj.account=`${re.name}@${myURL.hostname}`
    }
    if(re.icon && re.icon.url) obj.icon=re.icon.url;   
    return obj 
  }

  async function getInboxFromAccount(account) {
    let strs=account.split('@')
    let obj={name:strs[0],domain:strs[1],inbox:''}
    // console.log("url:"+`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
    let re=await net.get(`https://${strs[1]}/.well-known/webfinger?resource=acct:${account}`)
    // console.log(".well-known/webfinger",re)
    // console.log(re.message.links)
    if(re.code!==200) return obj;
    re=re.message;
    if(!re) return obj;
    let url,type;
    for(let i=0;i<re.links.length;i++)
    {
        if(re.links[i].rel==='self')
        {
            url=re.links[i].href;
            type=re.links[i].type
            break;
        }
    }
    let reobj=await getInboxFromUrl(url,type);
    return reobj;
  }

  module.exports = {
    getInboxFromAccount,
    getInboxFromUrl,
    getLocalInboxFromAccount,
    getLocalInboxFromUrl
  };