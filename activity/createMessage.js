function createMessage(name,domain,text,fileName,path,messageId,title)
{   
    let d=new Date();    
    // const guid = d.getTime();

    let noteMessage = {
      'id': `https://${domain}/${path}/message/${messageId}`,
      'actor': `https://${domain}/u/${name}`,
      'attributedTo':`https://${domain}/u/${name}`,
      'type': 'Article',
      'published': d.toISOString(),
      'attributedTo': `https://${domain}/u/${name}`,
      'content': text,
      'draft': false,
      'name':title,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/u/${name}/follower`]
    };
  
    if(fileName && path)
    {
      noteMessage['attachment']=[{
        'mediaType':'image/jpeg',
        'name':'Banner',
        'type':'Document',
        'url': `https://${domain}/uploads/${path}/${fileName}`,
      }]
    }
    let createMessage = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${domain}/${path}/message/${messageId}/activity`,
      'type': 'Create',
      'published': d.toISOString(),
      'actor': `https://${domain}/u/${name}`,
      'attributedTo':`https://${domain}/u/${name}`,
      'to': ['https://www.w3.org/ns/activitystreams#Public'],
      'cc':[`https://${domain}/u/${name}/follower`],
      'object': noteMessage
    };
    return createMessage;
}

// function createDelete(name,domain,guidCreate,guidNote,follower)
// {
   
//     let noteMessage = {
//       '@context': 'https://www.w3.org/ns/activitystreams',
//       'id': `${guidCreate}#delete`,
//       'type': 'Delete',
//       'actor': `https://${domain}/u/${name}`,
//       'to': [ 'https://www.w3.org/ns/activitystreams#Public' ],
//       'object': {
//         'id': guidNote,
//         'type': 'Tombstone',
//         'atomUri': guidNote
//       },

//     };
//     return createMessage;
// }



module.exports = {
    createMessage
};