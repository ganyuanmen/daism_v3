
// import { Button } from "bootstrap";
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiFollow from "./EnKiFollow";
import {useSelector, useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';
import { useState,useEffect } from "react";
import { client } from "../../../lib/api/client";

export default function FollowItem1({messageObj,t}) {
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    const [isFollow,setIsFollow]=useState(true); //是否已关注

    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    // const loginsiwe = useSelector((state) => state.valueData.loginsiwe)

    useEffect(()=>{
        let ignore = false; 
        if(actor?.actor_account){
            client.get(`/api/getData?actorAccount=${messageObj.account}&userAccount=${actor?.actor_account}`,'getFollow').then(res =>{ 
                if (!ignore) 
                    if (res.status===200) setIsFollow(!!res.data.id)
                    else console.error(res.statusText)
            });
        }else{
            setIsFollow(true) //没登录，没注册，不允许关注
        }

        return () => {ignore = true}
    },[actor])

    return (
        
            <Row className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember messageObj={messageObj} isLocal={false} hw={32} /></Col>
                <Col>
                    {actor?.actor_account && !isFollow && <EnKiFollow  t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                    }
                </Col>
                
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

