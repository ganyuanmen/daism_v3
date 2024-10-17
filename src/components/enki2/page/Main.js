import { Button } from "react-bootstrap";
import Loadding from "../../Loadding";
import ShowErrorBar from "../../ShowErrorBar";
import EnkiMessageCard from "../form/EnkiMessageCard";

/**
 * 社区主界面
 */
export default function Main({t,setCurrentObj,setActiveTab,data,currentPageNum,setCurrentPageNum,status,total,errors}) {  
  
    return (
        <>
            <div className="d-flex flex-wrap justify-content-between" >
                { data.map((obj,idx)=><EnkiMessageCard setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} messageObj={obj} key={obj.id}  t={t} />)}
            </div>
            <div>
                {status==='pending'?<Loadding />:
                (status==='failed'?<ShowErrorBar errStr={errors} />
                    :<>
                    {
                        data.length<total && <div><Button size='sm' onClick={()=>setCurrentPageNum(()=>currentPageNum+1)}  variant='light'>fetch more ...</Button></div>
                    }
                    </>
                )       
                }
            </div>
        </>
    );
}




