
const user=require('./user')
const follow=require('./folllow')
const message=require("./message")
const dao=require("./dao")

module.exports = {
  saveUser:user.saveUser
  ,getUser:user.getUser
  ,updateActor:user.updateActor
  ,getActor:user.getActor
  ,updateUser:user.updateUser
  ,getAccount:user.getAccount
  ,getFollower:follow.getFollower
  ,getFollowers:follow.getFollowers
  ,getFollowee:follow.getFollowee
  ,getFollowees:follow.getFollowees
  ,saveFollow:follow.saveFollow
  ,removeFollow:follow.removeFollow
  ,getMessage:message.getMessage
  ,saveMessage:message.saveMessage
  ,getMessages:message.getMessages
  ,getMessageFromId:message.getMessageFromId
  ,getInviteDao:dao.getInviteDao
  ,getVerifyDao:dao.getVerifyDao
  ,inviteAdd:dao.inviteAdd
  ,delInvite:dao.delInvite
  ,approve:dao.approve
  ,getHomeData:dao.getHomeData
  ,getDaoMembers:dao.getDaoMembers
  ,getAccountFromDaoid:user.getAccountFromDaoid
  ,getDaoFromDid:user.getDaoFromDid
  ,getDaoFollowers:follow.getDaoFollowers
}

