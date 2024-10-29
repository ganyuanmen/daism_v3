import TimesItem from "../../federation/TimesItem";
import EnkiMember from "./EnkiMember"
import EnkiEditItem from "./EnkiEditItem"
import EnKiFollow from "./EnKiFollow";
import { useState,useEffect } from "react";
import { client } from "../../../lib/api/client";
import { useSelector } from 'react-redux';

//isMess 是否可修改的
export default function EnkiMemberItem({t,actor,messageObj,delCallBack,preEditCall,showTip,closeTip,showClipError,isMess}) {
    const [isFollow,setIsFollow]=useState(true) //默认已关注
    const daoAddress=useSelector((state) => state.valueData.daoAddress)
    const daoActor=useSelector((state) => state.valueData.daoActor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    useEffect(() => {
        let ignore = false; //getFollow, //获某一关注 {actorAccount,userAccount} userAccount 关注  actorAccount
        if(actor?.actor_account)
        client.get(`/api/getData?actorAccount=${messageObj.actor_account}&userAccount=${actor?.actor_account}`,'getFollow').then(res =>{  
            if (!ignore) 
                if (res.status===200) setIsFollow(!!res.data.id)
                else console.error(res.statusText)
        });
        return () => {ignore = true}
        
    }, []);

 

    const checkDao=()=>{ 
        if(!actor?.actor_account || !actor?.actor_account.includes('@')) return false;
        let _member=daoActor.find((obj)=>{return obj.dao_id===messageObj.dao_id})
        if(_member) return true;
        else return false;
    }


    return (
        <div className="d-flex justify-content-between align-items-center">
            <EnkiMember messageObj={messageObj} isLocal={!messageObj?.message_id.startsWith('http')} />
            {actor?.actor_account && !isFollow && messageObj.actor_account!==actor?.actor_account && 
            <EnKiFollow t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} /> }
            
            <div>
                {isMess && loginsiwe && (
                    (messageObj.manager && actor?.manager?.toLowerCase()===messageObj.manager?.toLowerCase()) || 
                    (actor?.manager?.toLowerCase()===daoAddress['administrator'].toLowerCase())|| 
                    checkDao()
                ) && 
                    <EnkiEditItem messageObj={messageObj}  t={t} delCallBack={delCallBack} preEditCall={preEditCall} />
                } 
                <TimesItem times={messageObj.times} t={t} />
            </div>
        </div>
    );
}

// checkDomain(messageObj.actor_account,messageObj.dao_id) &&