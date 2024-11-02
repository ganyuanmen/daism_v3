import TimesItem from "../../federation/TimesItem";
import EnkiMember from "./EnkiMember"
import EnkiEditItem from "./EnkiEditItem"
import { useSelector } from 'react-redux';

//关注内容 
export default function ReplyItem({t,paccount,replyObj,actor,delCallBack,preEditCall,sctype}) {
    const daoAddress=useSelector((state) => state.valueData.daoAddress)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

 const editCallBack=()=>{
    preEditCall(replyObj)
 }
 const checkDomain=()=>{  //发文的同域名可以修改
       
    if(paccount && paccount.includes('@')){
        const [name,domain]=paccount.split('@');
        return domain===daoAddress['sys_domain']
    }
    return false;
}

    return (
        <div style={{borderBottom:'1px solid #D2D2D2'}}>
           <div className="d-flex justify-content-between align-items-center" style={{paddingLeft:"20px"}}  >
                <EnkiMember messageObj={replyObj} isLocal={false} hw={32} />
                <div  >
                    {checkDomain() && loginsiwe && (replyObj?.manager && actor?.manager?.toLowerCase()===replyObj?.manager?.toLowerCase() || actor?.manager?.toLowerCase()===daoAddress['administrator'].toLowerCase()) && 
                        <EnkiEditItem  messageObj={replyObj}  t={t} delCallBack={delCallBack} preEditCall={editCallBack} type={1} sctype={sctype} />
                    } 
                    <TimesItem times={replyObj.times} t={t} />
                </div>
            </div> 
            <div className="daism-reply-item" dangerouslySetInnerHTML={{__html: `<p>${replyObj.content.replaceAll("\r\n",'</p><p>')}</p>`}}></div> 
        </div> 
    );
}

