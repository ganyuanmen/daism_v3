import { Button } from "react-bootstrap";
import { useState } from "react";
import { Heart } from '../../../lib/jssvg/SvgCollection';
import { useGetHeartAndBook } from "../../../hooks/useMessageData";
import { client } from "../../../lib/api/client";

//点赞按钮
export default function EnKiHeart({t,tc,pid,loginsiwe,actor,showTip,closeTip,showClipError})
{
    const [refresh,setRefresh]=useState(false)
    const data=useGetHeartAndBook({cid:actor?.id,pid,refresh,table:'heart'})

    const submit=async (flag)=>{ //0 取消点赞  1 点赞
        showTip(t('submittingText')) 
        let res=await client.post('/api/postwithsession','handleHeartAndBook',{cid:actor.id,pid,flag,table:'heart'})
        if(res.status===200) setRefresh(!refresh) 
        else showClipError(`${tc('dataHandleErrorText')}!${res.statusText}\n ${res.data.errMsg?res.data.errMsg:''}`)
        closeTip()
    }
    //data.pid>0 已点赞
    return(
        <>
            {loginsiwe?
                <div>
                    {data.pid>0?
                        <Button onClick={e=>{submit(0)}}  variant="light">
                            <span style={{color:'red'}} ><Heart size={24} /></span>  {t('likeText')} {data?.total}
                        </Button>
                    : <Button onClick={e=>submit(1)}  variant="light"><Heart size={24} /> {t('likeText')} {data?.total} </Button>
                    }
               
                </div>
                :<div>{t('likeText')} {data?.total}</div>
            }
        </>
    );
}

