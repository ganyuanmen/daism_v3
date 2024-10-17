import { Button, Row,Col } from 'react-bootstrap';
import { BookTap,EditSvg,Home,Event,ToolsSvg,Follow} from '../../../lib/jssvg/SvgCollection';
import Loginsign from '../../../components/Loginsign';
import EnkiAccount from './EnkiAccount';
import { useSelector} from 'react-redux';
import SearchInput from './SearchInput';
import { useState,useEffect} from 'react';
import SmartCommonList from './SmartCommonList';
import EnkiMember from './EnkiMember';
import { client } from '../../../lib/api/client'
import { useRef } from 'react';


//createPost 创建发文 homeCall主页  eventFilter活动 smartcommonClick 智能公器选择单击 daoObj 智能公器选择对象
export default function EnkiTools({t,tc,actor,user,createPost,homeCall,eventFilter,smartcommonClick,daoObj,myBookFilter,myFollowFilter,searchCall,})
{
  const isWalletLogin=()=>{return user.connected===1} //是否钱包登录 
  const isSiweLogin=()=>{return loginsiwe} //是否siwe 登录
  // const isDaoMember=()=>{return daoActor.length>0} //是否 smart common 成员
  // const isRegister=()=>{return !!actor.account} //是否已个人注册
  const loginsiwe = useSelector((state) => state.valueData.loginsiwe)  //siwe登录
	// const daoActor = useSelector((state) => state.valueData.daoActor)  //dao列表
  const daoAddress=useSelector((state) => state.valueData.daoAddress)
  const [visible, setVisible] = useState(false); //是否显示智能公器列表
  const [isCreate,setIsCreate]=useState(false); //是否可以发文， dao_id>0时 非智能公器成员不能创建

  useEffect(()=>{
    let ignore = false;
    if(daoObj.dao_id>0){
      client.get(`/api/getData?did=${user.account}&daoid=${daoObj.dao_id}`,'getIsDaoMember').then(res =>{ 
        if (!ignore) {
          if (res.status===200 && res.data.length>0) setIsCreate(true);
          else setIsCreate(false);
        }
      });
      
    }
    else setIsCreate(true) //个人帐号允许发文

    return () => {ignore = true}
  },[user,daoObj])

  const divRef = useRef(null);
 
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setVisible(false)
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);


  const togglePanel = () => {setVisible(!visible);};
  const callBack=(obj)=>{setVisible(!visible);smartcommonClick(obj);}

  const checkActor=()=>{//检测amrst common 帐号是否同一域名
    if(!daoObj.actor_account)  return actor.domain===daoAddress['sys_domain'] ; //允许
    else{
      const [name,domain]=daoObj.actor_account.split('@')
      return domain===daoAddress['sys_domain']
    }
  }
 
  return(
    <>
    <div style={{border:'1px solid #D2D2D2',borderRadius:'10px'}}>
      <Row  className="d-flex align-items-center justify-content-between p-2">
        <Col className='col-auto me-auto' >{daoObj.manager?<EnkiMember messageObj={daoObj} isLocal={true} hw={64} />:<EnkiAccount t={t} /> } </Col>         
        <Col className='col-auto me-auto' >
          { isWalletLogin()?
            <> {isSiweLogin()?
                  <>{actor?.actor_account && <>
                    <SearchInput searchCall={searchCall} actor={actor} t={t} />
                    
                    { isCreate && checkActor() && <Button className='mt-2'  variant="primary" size='sm' onClick={e=>{createPost.call()}} ><EditSvg  size={18} /> {t('createPost')} </Button> }
                    </>
                  }
                  </>
                  : <Loginsign user={user} tc={tc} />
                }
            </>
            :<span>{tc('noConnectText')}</span>
          }
        </Col>
        <Col className='col-auto' >
          <div>
            <Button variant="light" onClick={e=>{homeCall.call()}} ><Home size={20} /> {t('homePage')} </Button>
            {actor?.actor_account && <>
                <Button variant="light" onClick={e=>{myBookFilter.call()}} ><BookTap size={20} /> {t('mybookTap')} </Button>
                <Button variant="light" onClick={e=>{eventFilter.call()}} ><Event size={24} /> {t('eventPost')} </Button>
              </>
            }
          </div>
          <div>
          <Button variant="light"  onClick={togglePanel} ><ToolsSvg  size={20} /> {t('smartcommonText')} </Button>
          {actor?.actor_account && <Button variant="light" onClick={e=>{myFollowFilter.call()}} ><Follow size={20} /> {t('myPostText')} </Button>}
          </div>
        </Col>
      </Row>    
    </div>
    <div ref={divRef} className={`panel ${visible ? 'visible' : ''}`}>
        <SmartCommonList callBack={callBack} />
    </div>
    </>
  );
}

