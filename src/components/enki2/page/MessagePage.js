import { Card,Button } from "react-bootstrap";
import { useState,useEffect, useRef } from 'react';
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply from '../form/MessageReply'
import ReplyItem from "../form/ReplyItem";
import Loadding from "../../Loadding";
import ShowErrorBar from "../../ShowErrorBar";
import {useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import { ExitSvg } from "../../../lib/jssvg/SvgCollection";
import EnkiShare from "../form/EnkiShare";
import { client } from "../../../lib/api/client";

/**
 * 单个信息界面 // preEditCall:修改前回调 delCallBack:删除后已刷新
 * isEdit 我的社区和个人社区 允许修改， 公共社区不可修改
 */
export default function MessagePage({t,tc,currentObj,actor,loginsiwe,domain,delCallBack,preEditCall,setActiveTab}) { 
    const[fetchWhere, setFetchWhere] = useState({currentPageNum:0
        ,account:currentObj.actor_account 
        ,sctype:currentObj.dao_id>0?'sc':''
        ,pid:currentObj.id});
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");

    const [total,setTotal]=useState(0);//回复总数
    const [refresh,setRefresh]=useState(false);  //刷新回复总数
    const [replyObj,setReplyObj]=useState(null) //回复内容，用于修改，为null表示新增
            
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}  
    const repluBtn=useRef()
   
     //选取回复总数  
     useEffect(()=>{
       let ignore = false;
       client.get(`/api/getData?sctype=${currentObj.dao_id>0?'sc':''}&pid=${currentObj.id}`,'getReplyTotal').then(res =>{ 
           if (!ignore) 
               if (res.status===200) setTotal(res.data)
         });
       return () => {ignore = true}
   },[currentObj,refresh])

    const callBack=()=>{setFetchWhere({...fetchWhere,currentPageNum:0});setRefresh(!refresh)} //删除、增加回复后后回调
    const preEditCallBack=(obj)=>{setReplyObj(obj);repluBtn.current.show();} //修改评论 ，弹出窗口
    const afterEditcall=()=>{setReplyObj(null);callBack();}
    
    useEffect(() => {
        // console.log("---------------->>>",fetchWhere)
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&pid=${fetchWhere.pid}&account=${fetchWhere.account}&sctype=${fetchWhere.sctype}`,'replyPageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        // console.log("reply data",res.data)
                        setHasMore(res.data.length >= 20);
                        if (fetchWhere.currentPageNum === 0) setData(res.data);
                        else setData([...data, ...res.data]);
                        setErr('');
                    } else { 
                        setHasMore(false); //读取错误，不再读
                        setErr(res?.data?.errMsg || "Failed to read data from the server");
                    }
                } else 
                {
                    setHasMore(false); //读取错误，不再读
                    setErr(res?.statusText || res?.data?.errMsg );
                }

            } catch (error) {
                console.error(error);
                setHasMore(false); //读取错误，不再读
                setErr(error?.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    
    }, [fetchWhere]);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //         const scrollHeight = document.documentElement.scrollHeight;
    //         const clientHeight = document.documentElement.clientHeight;
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             console.log('reply滚动到底部了', [fetchWhere, hasMore]);
    //             if (hasMore) setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 });
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [fetchWhere, hasMore]);
    
    return (
        <div className="mt-3" style={{width:'100%'}}>
        <div className="mt-2 mb-2" >
         {setActiveTab && <Button onClick={e=>{ setActiveTab(0)}} ><ExitSvg size={24} />  {t('esctext')}</Button>}
        </div>
            {currentObj?.top_img && 
             <div className="mt-2 mb-2" style={{ position:'relative', textAlign:'center'}} >
                <img src={currentObj?.top_img} alit='' style={{maxHeight:'200px'}} />
            </div>
            }
        <h1>{currentObj?.title}</h1>
        <Card className="mb-3" >
            <Card.Header>
                <EnkiMemberItem t={t} messageObj={currentObj} actor={actor}  delCallBack={delCallBack} preEditCall={preEditCall} showTip={showTip} closeTip={closeTip} showClipError={showClipError} isEdit={currentObj.send_type===0} />
               {/* 活动 */}
               {currentObj?._type===1 && <EventItem t={t} currentObj={currentObj} /> }
            </Card.Header>
        <Card.Body>
            <div dangerouslySetInnerHTML={{__html: currentObj?.content}}></div>
        </Card.Body>
        <Card.Footer style={{padding:0}} >
            <div className="d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:'4px 8px'}}  >
                
                <MessageReply  t={t} tc={tc} actor={actor} currentObj={currentObj} total={total}
                 addReplyCallBack={callBack} replyObj={replyObj} setReplyObj={setReplyObj} domain={domain} loginsiwe={loginsiwe}
                 afterEditcall={afterEditcall} ref={repluBtn} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />

                <EnKiHeart t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} currentObj={currentObj} domain={domain} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                <EnKiBookmark t={t} tc={tc} loginsiwe={loginsiwe} actor={actor} currentObj={currentObj} domain={domain} showTip={showTip} closeTip={closeTip} showClipError={showClipError}  />
                <EnkiShare currentObj={currentObj} t={t} domain={domain} tc={tc} />
            </div>
            {currentObj?.link_url && <div className="mt-2 mb-2" style={{textAlign:'center'}}>
                    <a  href={currentObj?.link_url} >{t('origlText')}......</a>
                    </div> 
            }
        
            {data.map((obj,idx)=><ReplyItem key={obj.id} t={t} paccount={currentObj.actor_account} replyObj={obj} actor={actor} delCallBack={callBack} preEditCall={preEditCallBack} sctype={currentObj.dao_id>0?'sc':''} />)}
          
                {isLoading?<Loadding />
                : hasMore && <Button onClick={()=>setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 })} variant='light'>fetch more ...</Button>
                }
                {err && <ShowErrorBar errStr={err} /> }
         

        </Card.Footer>
        </Card>
       
        </div>
    );
}




