import withSession from "../../../lib/session";
import formidable from 'formidable';
import { executeID,getData,execute } from "../../../lib/mysql/common";
import { send } from "../../../lib/utils/send";
import { saveImage } from "../../../lib/utils";
const { v4: uuidv4 } = require("uuid");

export const config = {
  api: {
    sizeLimit: '10mb',
    bodyParser: false,
  },
};

export default withSession(async (req, res) => {
  if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'Method Not Allowed'})
  const sessionUser = req.session.get('user');
  if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})
  try {  
    const form = formidable({})
    const [fields, files] = await form.parse(req);
    const {_type,id,account,did,title,content,isSend,isDiscussion,videoUrl,startTime,endTime,eventUrl,eventAddress,fileType,time_event} = fields
    const imgPath=saveImage(files,fileType[0])
    let path=imgPath?`https://${process.env.LOCAL_DOMAIN}/${process.env.IMGDIRECTORY}/${imgPath}`:''
    if(id[0]=='0'){ //增加
      let message_id=uuidv4()
      let rows=await getData("select dao_id,domain,actor_name,avatar,actor_url,actor_inbox from v_account where actor_account=?",[account[0]])
      let sql='';
      let paras=[_type[0],message_id.replaceAll('-',''),did[0],rows[0].actor_name,rows[0].avatar,account[0],rows[0].actor_url,title[0],content[0],isSend[0],isDiscussion[0],path,videoUrl[0],rows[0].dao_id,rows[0].actor_inbox];
      if(_type[0]=='1') { //活动发文
      sql='INSERT INTO a_message(_type,message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,video_url,dao_id,actor_inbox,start_time,end_time,event_url,event_address,time_event) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)' 
      paras=paras.concat([startTime[0],endTime[0],eventUrl[0],eventAddress[0],time_event[0]])
      }
      else{  //普通发文
        sql='INSERT INTO a_message(_type,message_id,manager,actor_name,avatar,actor_account,actor_url,title,content,is_send,is_discussion,top_img,video_url,dao_id,actor_inbox) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      }

      let insertId=await executeID(sql,paras);
      if(insertId) {
        if(parseInt(isSend[0])===1) {
          if( process.env.IS_DEBUGGER==='1') console.info("message send --->",[account[0],path,insertId,title[0]])
            send(account[0],content[0],path,insertId,`《${title[0]}》`,path)   
        }
        res.status(200).json({msg:'handle ok',id:insertId});
      } else res.status(500).json({errMsg: 'fail'});
    }else{ //修改
      
        if(!path && fileType[0]){ //不修改img
          let re=await getData("select top_img from a_message where id=?",[id[0]])
          path=re[0]['top_img']
        }

      if(_type[0]=='1') { //活动发文
        let sql="update a_message set _type=1,title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=?,end_time=?,event_url=?,event_address=?,time_event=? where id=?"
        let lok=await execute(sql,[title[0],content[0],isSend[0],isDiscussion[0],path,startTime[0],endTime[0],eventUrl[0],eventAddress[0],time_event[0],id[0]])
        if(lok) res.status(200).json({title:title[0],content:content[0],is_send:isSend[0],is_discussion:isDiscussion[0],top_img:path,start_time:startTime[0],end_time:endTime[0],event_url:eventUrl[0],event_address:eventAddress[0],time_event:time_event[0]}); 
        else res.status(500).json({errMsg:'save fail'}); 
      }else {//普通发文
        let sql="update a_message set _type=0,title=?,content=?,is_send=?,is_discussion=?,top_img=?,start_time=NULL,end_time=NULL,event_url=NULL,event_address=NULL,time_event=-1 where id=?";
        let lok= await execute(sql,[title[0],content[0],isSend[0],isDiscussion[0],path,id[0]])
        if(lok) res.status(200).json({title:title[0],content:content[0],is_send:isSend[0],is_discussion:isDiscussion[0],top_img:path}); 
        else res.status(500).json({errMsg:'save fail'}); 
      }
     
    }
   
  } catch (err) {
      console.error(err);
      res.status(err.httpCode || 500).json({errMsg: err});
      return;
  }
});

