
function follow_click() {
    console.log('------------start')
    let account=$('#faccount').val()
    if(!account)
    {
        alert(' 对方帐号不能为空')
        return
    }
    if(!account.startsWith('http'))
    {
        let names=account.split('@')
        if(names.length!==2)
        {
            alert(' 对方帐号非法')
            return  
        }
    }
    postData('/api/admin/follow', {account,name:window.login_name}).then(e=>console.log(e))

    //  //获取个人资源URL
    // fetch(`https://${names[1]}/.well-known/webfinger?resource=acct:${account}`, {
    //       method: "GET"
    //   })
    //   .then(response => response.json())
    //   .then(e=>{
    //     if(!e.links) {
    //         console.log('no found')
    //         return
    //     }
    //     let url,type;
    //     for(let i=0;i<e.links.length;i++)
    //     {
    //         if(e.links[i].rel==='self')
    //         {
    //             url=e.links[i].href;
    //             type=e.links[i].type
    //             break;
    //         }
    //     }
    //     //获取个人信息
    //     postData('/api/admin/user', {url:encodeURIComponent(url),type:encodeURIComponent(type)})
    //     .then(data => {
    //        console.log('data', data);
          
    //     }) 
    //     .catch(error => console.error(error));

    //   })
  
  }
  
