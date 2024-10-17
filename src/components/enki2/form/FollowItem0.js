
import EnkiMember from "./EnkiMember"
import { Row,Col } from "react-bootstrap";
import EnKiUnFollow from './EnKiUnFollow'
import {useSelector, useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../../data/valueData';

export default function FollowItem0({messageObj,t}) {
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    function showClipError(str){dispatch(setMessageText(str))}  
    const actor = useSelector((state) => state.valueData.actor)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
 
    return (
        
            <Row className="d-flex align-items-center" style={{borderBottom:"1px solid #D2D2D2",padding:"5px 2px"}}  >
                <Col><EnkiMember messageObj={messageObj} isLocal={false} hw={32} /></Col>
                {loginsiwe && <Col>
                    <EnKiUnFollow t={t} searObj={messageObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                </Col>
                }
                <Col>{messageObj.createtime}(UTC+8)</Col>
            </Row>
          
      
    );
}

