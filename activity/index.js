const crypto = require('crypto');
const message=require("./createMessage")

function createActor(name, domain,account) {
    return {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        'https://w3id.org/security/v1'
      ],
  
      'id': `https://${domain}/u/${name}`,
      'type': 'Group',
      'preferredUsername': `${name}`,
      'name': `${name}`,
      // 'did':account.did,
      'inbox': `https://${domain}/u/${name}/inbox`,
      'outbox': `https://${domain}/u/${name}/outbox`,
      'followers': `https://${domain}/u/${name}/followers`,
      'following': `https://${domain}/u/${name}/following`,
      'icon': {
        'type': 'Image',
        'mediaType': 'image/png',
        'url': account.icon
      },
      'publicKey': {
        'id': `https://${domain}/u/${name}#main-key`,
        'owner': `https://${domain}/u/${name}`,
        'publicKeyPem': account.pubkey
      }
    };
  }
  
  function createWebfinger(name, domain) {
    return {
      'subject': `acct:${name}@${domain}`,
  
      'links': [
        {
          'rel': 'self',
          'type': 'application/activity+json',
          'href': `https://${domain}/u/${name}`
        }
      ]
    };
  }

  
function createAccept(thebody, name, domain) {
    const guid = crypto.randomBytes(16).toString('hex');
    return {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': `https://${domain}/${guid}`,
      'type': 'Accept',
      'actor': `https://${domain}/u/${name}`,
      'object': thebody,
    };
  }
  
   
function createFollow(name, domain,actorUrl,guid) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    'id': `https://${domain}/${name}/follow/${guid}`,
    'type': 'Follow',
    'actor': `https://${domain}/u/${name}`,
    'object': actorUrl
  };
 }

   
function createUndo(name, domain,actorUrl,followId) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    'id': followId.replace('follow','undo') , // `https://${domain}/${name}/undo/${guid}`,
    'type': 'Undo',
    'actor': `https://${domain}/u/${name}`,
    'object': {
      'id': followId,
      'type': 'Follow',
      'actor': `https://${domain}/u/${name}`,
      'object': actorUrl
    }
  }
 }

//  '@context': 'https://www.w3.org/ns/activitystreams',
//  id: 'https://daotodon.me/923de01d-d55a-4ca3-93b5-abf52b1349d1',
//  type: 'Follow',
//  actor: 'https://daotodon.me/users/gym',
//  object: 'https://nngym.cn/u/gym'

 
 function createFollowers(name,domain,followers)
 {
  return {
    "type":"OrderedCollection",
    "totalItems":followers.length,
    "id":`https://${domain}/u/${name}/followers`,
    "first": {
      "type":"OrderedCollectionPage",
      "totalItems":followers.length,
      "partOf":`https://${domain}/u/${name}/followers`,
      "orderedItems": followers,
      "id":`https://${domain}/u/${name}/followers?page=1`
    },
    "@context":["https://www.w3.org/ns/activitystreams"]
  };
 }
  
 function createFollowees(name,domain,followees)
 {
  return {
    "type":"OrderedCollection",
    "totalItems":followees.length,
    "id":`https://${domain}/u/${name}/following`,
    "first": {
      "type":"OrderedCollectionPage",
      "totalItems":followees.length,
      "partOf":`https://${domain}/u/${name}/following`,
      "orderedItems": followees,
      "id":`https://${domain}/u/${name}/following?page=1`
    },
    "@context":["https://www.w3.org/ns/activitystreams"]
  };
 }

  module.exports = {
    createActor,
    createWebfinger,
    createAccept,
    createFollow,
    createUndo,
    createFollowers,
    createFollowees,
    createMessage:message.createMessage
};