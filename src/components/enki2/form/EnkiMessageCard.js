


import Card from "react-bootstrap/Card";
import EnkiMemberItem from "./EnkiMemberItem";
import { useRouter } from 'next/navigation';
export default function EnkiMessageCard({t,setCurrentObj,setActiveTab,messageObj}) {
    const months=t('monthText').split(',')
    const router = useRouter();
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
    const url=`${locale==='zh'?'/zh/':'/'}communities/${path}/${currentObj.message_id}`;
    return (
   
        <Card className='mb-1' onClick={(e)=>{router.push(`/workroom/walletinfo`, { scroll: false })}} style={{width:'100%',maxHeight:'360px',overflow:'hidden' }}>
            <Card.Header>
            <EnkiMemberItem messageObj={messageObj} t={t} isFollow={true} isEdit={false}  />    {/* '不检测关注' 不修改不删除 */}
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
