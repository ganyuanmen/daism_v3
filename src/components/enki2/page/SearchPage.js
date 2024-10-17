import { Row,Col } from "react-bootstrap";
import EnkiMember from "../form/EnkiMember";
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData'
import EnKiFollow from "../form/EnKiFollow";
import EnKiUnFollow from "../form/EnKiUnFollow";

/**
 * 查找页面
 */
export default function SearchPage({t,searObj,actor}) {  
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showClipError(str){dispatch(setMessageText(str))}
  
    return (
        <div>
            <Row className="p-3 " style={{borderBottom:'1px solid #D2D2D2'}} >
                <Col className="col-auto me-auto" > <EnkiMember messageObj={searObj} isLocal={!!searObj.manager} /> </Col>
                {searObj.account && searObj.account !=actor?.actor_account &&
                <Col className="col-auto" >
                    {searObj.id>0?<EnKiUnFollow t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                        :<EnKiFollow  t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                    }
                </Col>
                }
            </Row>
            <div dangerouslySetInnerHTML={{__html:searObj.desc}}></div>
        </div>
    );
}




