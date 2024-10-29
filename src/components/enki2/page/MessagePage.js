import { Card,Button } from "react-bootstrap";
import { useState,useEffect, useRef } from 'react';
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply from '../form/MessageReply'
import { useReply } from "../../../hooks/useMessageData";
import ReplyItem from "../form/ReplyItem";
import Loadding from "../../Loadding";
import ShowErrorBar from "../../ShowErrorBar";
import {useSelector, useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import { ExitSvg } from "../../../lib/jssvg/SvgCollection";
import EnkiShare from "../form/EnkiShare";

/**
 * 单个信息界面 // preEditCall:修改前回调 delCallBack:删除后已刷新
 */
export default function MessagePage({t,tc,currentObj,actor,delCallBack,preEditCall,setActiveTab}) {  
    const [replyObj,setReplyObj]=useState(null)
    const [replyData,setReplyData]=useState([]) //回复数据集合
    const [replyPageNum, setReplyPageNum] = useState(1); //回复的当前页
    const [refresh,setRefresh]=useState(false);
    const messageData = useReply({account:currentObj.actor_account,dao_id:currentObj.dao_id,replyPageNum,refresh,pid:currentObj.id}) 
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const daoAddress=useSelector((state) => state.valueData.daoAddress)
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  

    useEffect(()=>{setReplyData(replyData.concat(messageData.rows))},[messageData])
    const repluBtn=useRef()


    const callBack=()=>{setReplyData([]);setRefresh(!refresh);setReplyPageNum(1);} //删除、增加回复后后回调
    const preEditCallBack=(obj)=>{setReplyObj(obj);
        alert('ookk')
        repluBtn.current.show();}
    const afterEditcall=(obj)=>{setReplyObj(null);callBack();}

    const ableChange=(flag)=>{  // true 回复，
        let re= flag?currentObj?.is_discussion:1;  //非回复都允许点击
       
        if(re) //允许回复条件 再判断
            if(currentObj.actor_account && currentObj.actor_account.includes('@')){
                const [name,domain]=currentObj.actor_account.split('@');
                re=(domain===daoAddress['sys_domain']);
            }

        return re?1:0;
    }

    return (
        <>
        <div className="mt-2 mb-2" >
            <Button onClick={e=>{ setActiveTab(0)}} ><ExitSvg size={24} />  {t('esctext')}</Button>
        </div>
            {currentObj?.top_img && 
             <div className="mt-2 mb-2" style={{ position:'relative', textAlign:'center'}} >
                <img src={currentObj?.top_img} alit='' style={{maxHeight:'200px'}} />
            </div>
            }
        <h1>{currentObj?.title}</h1>
        <Card className="mb-3" >
            <Card.Header>
                <EnkiMemberItem t={t} messageObj={currentObj} actor={actor}  delCallBack={delCallBack} preEditCall={preEditCall} showTip={showTip} closeTip={closeTip} showClipError={showClipError} isMess={true} />
                {currentObj?._type===1 && <EventItem t={t} currentObj={currentObj} /> }
            </Card.Header>
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: currentObj?.content}}></div>
        </Card.Body>
        <Card.Footer style={{padding:0}} >
            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                <MessageReply isd={ableChange(true)} actor={actor} pid={currentObj?.id}  t={t} tc={tc} total={messageData.total} addReplyCallBack={callBack} replyObj={replyObj}  afterEditcall={afterEditcall} ref={repluBtn} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                <EnKiHeart isd={ableChange(false)} t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} pid={currentObj?.id} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                <EnKiBookmark isd={ableChange(false)} t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} pid={currentObj?.id} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                <EnkiShare currentObj={currentObj} t={t} daoAddress={daoAddress} tc={tc} />
            </div>
            {currentObj?.link_url && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
                    <a  href={currentObj?.link_url} >{t('origlText')}......</a>
                    </div> 
            }
        
            {replyData.map((obj,idx)=><ReplyItem key={obj.id} t={t} paccount={currentObj.actor_account} replyObj={obj} actor={actor} delCallBack={callBack} preEditCall={preEditCallBack} />)}
            <div>
                {messageData.status==='pending'?<Loadding />:
                (messageData.status==='failed'?<ShowErrorBar errStr={errors} />
                    :<>
                    {
                        replyData.length<messageData.total && <div><Button size='sm' onClick={()=>setReplyPageNum(()=>replyPageNum+1)}  variant='light'>fetch more ...</Button></div>
                    }
                    </>
                )       
                }
            </div>
        </Card.Footer>
        </Card>
       
        </>
    );
}




