import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import ShowErrorBar from '../../../components/ShowErrorBar';
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import Loginsign from '../../../components/Loginsign';
import { Nav } from 'react-bootstrap';
import Main from '../../../components/enki2/page/Main';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import MessagePage from '../../../components/enki2/page/MessagePage';
import iaddStyle from '../../../styles/iadd.module.css'
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';

export default function mySC({ domain }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
        daoid: '',  //所有'1,2,..', 单个'1' 方便sql in(${daoid})
        actorid: 0, account: '', 
        where: '', //查询条件
        menutype: 1,
        v:0, 
        order: 'reply_time', //排序
        eventnum: 0  //0 活动 1 非活动
     });

    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);

    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const [daoData, setDaoData] = useState([]) //所属个人的社区列表

    useEffect(() => { if (Array.isArray(daoActor)) setDaoData(daoActor.filter(obj => obj.actor_account)) }, [daoActor])

    useEffect(() => {
        if (daoData.length > 0) {
            setFetchWhere({
                ...fetchWhere,
                daoid: daoData.map((item) => { return item.dao_id }).join(',')
            })
        }
    }, [daoData, actor])

    const latestHandle=()=>{
        //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time', account: '', eventnum: 0, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
    }

    const eventHandle=()=>{
        //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'id', account: '', eventnum: 1, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') })
        setActiveTab(0);
    }

    const publishHandle=()=>{setCurrentObj(null);setActiveTab(1);}
    

    const refreshCallBack = () => {  setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'reply_time', account: '', eventnum: 0, where: '', daoid: daoData.map((item) => { return item.dao_id }).join(',') });
     setActiveTab(0); } //刷新数据,从0页开始
    const preEditCall=()=>{setActiveTab(1);} //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调
  
    return (
        <PageLayout>

            <div className="clearfix">
                {/* <div className="scleft">

                    {user.connected !== 1 ? <>
                        <ShowErrorBar errStr={tc('noConnectText')} />
                    </> : <>
                        {!loginsiwe ? <div>
                            <Loginsign user={user} tc={tc} />
                        </div> : <>
                            <EnkiMember messageObj={actor} isLocal={true} hw={64} />
                            {daoData.length > 0 ?
                                <Nav onSelect={handleSelect} defaultActiveKey="/home" className="flex-column">
                                    <Nav.Link eventKey="latest">{t('latestText')}</Nav.Link>
                                    <Nav.Link eventKey="events">{t('eventText')}</Nav.Link>
                                    <Nav.Link eventKey="create">{t('publishText')}</Nav.Link>
                                    {daoData.map((obj) => <Nav.Link key={obj.dao_id} eventKey={obj.dao_id}>
                                        <div style={{ display: 'flex' }} >
                                            <img alt={obj.dao_name} width={24} height={24} src={obj.dao_logo} />
                                            <span>{obj.actor_account}</span>
                                        </div>
                                    </Nav.Link>)}
                                </Nav>
                                : <ShowErrorBar errStr={t('noRegisterText')} />
                            }

                        </>}
                    </>
                    }
                </div> */}
                  <div className={iaddStyle.scsidebar}>
                    <div className='mb-3' >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} hw={64} /> : <EnkiAccount t={t} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    </div>
                    {loginsiwe &&<>
                        {Array.isArray(daoData) && daoData.length > 0 ?
                        <ul >
                            <li><a href="#" onClick={latestHandle} >{t('latestText')}</a></li>
                            <li><a href="#" onClick={eventHandle} >{t('eventText')}</a></li>
                            <li><a href="#" onClick={publishHandle} >{t('publishText')}</a></li>
                            {daoData.map((obj, idx) => <li key={obj.dao_id} className={iaddStyle.scli}>
                                <a href="#" onClick={e=>{
                                    setFetchWhere({ ...fetchWhere, currentPageNum:0,order:'id',eventnum:0,where:'',daoid:obj.dao_id,account:obj.actor_account})
                                    }} >
                                    <div style={{overflow:'hidden',display:'flex',alignItems:'center'}}>
                                    <img src={obj.dao_logo} alt={obj.actor_account} height={24} width={24} style={{marginRight:'10px'}} />{obj.actor_account}
                                    </div>
                                </a>
                                </li>)
                            }
                        </ul>
                        : <ShowErrorBar errStr={t('noRegisterText')} />
                        }
                    </>
                    }
                </div>

                {daoData.length > 0 && <div className={iaddStyle.sccontent}>

                    {activeTab === 0 && <Main t={t} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} />}
                    {activeTab === 1 && <EnkiCreateMessage domain={domain} daoData={daoData} actor={actor} t={t} tc={tc} addCallBack={refreshCallBack} currentObj={currentObj} afterEditCall={afterEditCall} />}
                    
                    {activeTab === 2 && <MessagePage t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} domain={domain}
                        currentObj={currentObj} delCallBack={refreshCallBack} preEditCall={preEditCall} setActiveTab={setActiveTab} />}

                </div>
                }

            </div>

        </PageLayout>
    )
}

export const getServerSideProps = ({ locale }) => {


    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale, domain: process.env.LOCAL_DOMAIN
        }
    }
}



