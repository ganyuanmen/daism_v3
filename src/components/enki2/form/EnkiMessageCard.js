


import Card from "react-bootstrap/Card";
import EnkiMemberItem from "./EnkiMemberItem";
import {convertHTML} from "../utils"

export default function EnkiMessageCard({t,setCurrentObj,setActiveTab,messageObj}) {
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
   
    return (
   
        <Card className='m-2' onClick={(e)=>{setCurrentObj(messageObj);setActiveTab(2);e.preventDefault();e.stopPropagation();}} style={{ width: '400px',height:'360px',overflow:'hidden' }}>
            <Card.Header>
            <EnkiMemberItem messageObj={messageObj} t={t} isFollow={true} isMess={false}  />    {/* '不检测关注' 不修改不删除 */}
            </Card.Header>
            
        <Card.Body className="daism-click"  >
            
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
        </Card.Body>
    </Card>

    );
}

// <div dangerouslySetInnerHTML={{__html:convertHTML(messageObj)}}></div>