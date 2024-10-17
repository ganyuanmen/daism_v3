export function createMessage(userName,domain,text,fileName,messageId,title,imgpath,message_domain)
{   
    userName=userName.toLowerCase()
    let d=new Date();  
    let suff=fileName.indexOf('.')>0?fileName.split('.').splice(-1)[0]:''
    let noteMessage = {
      'id': `https://${message_domain}/communities/${messageId}`,
      'url':`https://${message_domain}/communities/${messageId}`,
      'atomUri':`https://${message_domain}/communities/${messageId}`,
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
      'type':'Article',
      'published': d.toISOString(),
      'attributedTo': `https://${domain}/api/activitepub/users/${userName}`,
      'content': text,
      'draft': false,
      'name':title,
      'title':title,
      "imgpath":imgpath,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`]
    };
  
    if(fileName && suff)
    {
      noteMessage['attachment']=[{
        'mediaType':`image/${suff}`,
        'name':'Banner',
        'type':'Document',
        'url': fileName,
      }]
    }
    let createMessage = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${message_domain}/communities/${messageId}`,
      'type': 'Create',
      'published': d.toISOString(),
      'actor': `https://${domain}/api/activitepub/users/${userName}`,
      'attributedTo':`https://${domain}/api/activitepub/users/${userName}`,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/api/activitepub/follower/${userName}`],
      'object': noteMessage
    };
    return createMessage;
}
