


import Card from "react-bootstrap/Card";
import EnkiMemberItem from "./EnkiMemberItem";
const crypto = require('crypto');


export default function EnkiMessageCard({env, path, locale, t,messageObj}) {
    const months=t('monthText').split(',')
    const getMonth=()=>{
        let m=new Date(messageObj.start_time)
        return months[m.getMonth()]
    }
    const getDay=()=>{
        let m=new Date(messageObj.start_time)
        return m.getDate()
    }

    const bStyle={
        width:'80px',
        position:'absolute',
        top:'0',
        left:'0',
        borderRadius:'0.3rem',
        backgroundColor:'white'
    }
    const aStyle={
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textAlign:'center',
        textOverflow: 'ellipsis'
    }
    
const encrypt=(text)=>{
    const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  const getDomain=()=>{
    let _account=(messageObj.send_type==0?messageObj.actor_account:messageObj.receive_account);
    return _account.split('@')[1];
  }

    return (
   

        <Card className='mb-1' style={{width:'100%',maxHeight:'360px',overflow:'hidden' }}>
            <Card.Header>
            <EnkiMemberItem messageObj={messageObj} t={t} isFollow={true} isEdit={false} locale={locale}  />    {/* '不检测关注' 不修改不删除 */}
            </Card.Header>
            
        <Card.Body className="daism-click"  >
            <a className="daism-a" href={`/${locale}/communities/${path}?d=${encrypt(`${messageObj.id},${messageObj.dao_id},${getDomain()}`)}`} >
            <div>
            {messageObj._type===1?  <div style={{position:'relative'}}>
                {messageObj.top_img && <div style={{textAlign:'center'}} ><img src={messageObj.top_img} alt='' style={{maxHeight:'100px'}} /></div> }
                <div className='border' style={bStyle} >
                    <div style={{borderRadius:'0.3rem 0.3rem 0 0', backgroundColor:'red',height:'26px'}} ></div>
                    <div className='fs-4' style={{textAlign:'center'}} ><strong>{getDay()}{t('dayText')}</strong></div>
                    <div className='fs-7 mb-2' style={{textAlign:'center'}} ><strong>{getMonth()}</strong></div>
                </div>
            </div>:<>
            {messageObj.top_img && <div style={{textAlign:'center'}} ><img src={messageObj.top_img} alt='' style={{maxHeight:'100px'}} /></div> }
            </>}

           <h2 style={aStyle} >{messageObj.title} </h2>
           <div dangerouslySetInnerHTML={{__html:messageObj.content}}></div>
           </div>
           </a>
        </Card.Body>
        </Card>

    );
}
