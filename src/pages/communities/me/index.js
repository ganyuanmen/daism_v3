import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import iaddStyle from '../../../styles/iadd.module.css'
import Main from '../../../components/enki2/page/Main';
import MeCreate from '../../../components/enki2/page/MeCreate';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { useDispatch } from 'react-redux';
import {setTipText,setMessageText } from '../../../data/valueData'
import SearchInput from '../../../components/enki2/form/SearchInput'
import ShowErrorBar from '../../../components/ShowErrorBar';
import EnKiFollow from '../../../components/enki2/form/EnKiFollow';
import EnKiUnFollow from '../../../components/enki2/form/EnKiUnFollow'

//
export default function me({ domain }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
        daoid: 0,  //此处不用
        actorid: 0, account: '',
        where: '', //查询条件
        menutype: 3,
        v:0,
        order: 'reply_time', //排序
        eventnum: 1  //0 活动 1 非活动
    });
    
    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);
    const [searObj,setSearObj]=useState(null) //查找到的对象
    const [findErr,setFindErr]=useState(false) //没找到

    const dispatch = useDispatch();
    function showTip(str) { dispatch(setTipText(str)) }
    function closeTip() { dispatch(setTipText('')) }
    function showClipError(str) { dispatch(setMessageText(str)) }
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    
    // useEffect(() => { if (actor?.actor_account) setFetchWhere({ ...fetchWhere, actorid: actor.id, account: actor.actor_account }) }, [actor])

    const homeHandle=()=>{
         //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 1,account: '' })
        setActiveTab(0);
    }

    const createHandle=()=>{
        const [name,localdomain]=actor.actor_account.split('@');
        if(domain!==localdomain) return showClipError(t('loginDomainText',{domain:localdomain}));
        setCurrentObj(null);
        setActiveTab(1);
    }

    const myPostHandle=()=>{
        //account: '' 从源地读取
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2,account: actor?.actor_account })
        setActiveTab(0);
    }
 
    const myReceiveHandle=()=>{
            //account: '' 从源地读取
            setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 4,account: actor?.actor_account })
            setActiveTab(0);
    }
    const followManHandle=()=>{

    }

    const myBookHandle=()=>{
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 3,actorid:actor?.id,account: actor?.actor_account })
        setActiveTab(0);
    }
    
    const refreshCallBack = () => { setFetchWhere({ ...fetchWhere, currentPageNum: 0,eventnum:2 }); setActiveTab(0); } //刷新数据,从0页开始
    const preEditCall = () => { setActiveTab(1); } //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调

    return (
        <PageLayout>

            <div style={{ width: '100%' }} className="clearfix">
                  <div className={iaddStyle.scsidebar}>
                    <div className='mb-3' >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} hw={64} /> : <EnkiAccount t={t} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    </div>
                    <ul >
                        <li><a href="#" onClick={homeHandle} >{t('scHomeText')}</a></li>
                        {loginsiwe && actor?.actor_account && <>
                            <li><a href="#" onClick={createHandle} >{t('createPostText')}</a></li>
                            <li><a href="#" onClick={myPostHandle} >{t('myPostText')}</a></li>
                            <li><a href="#" onClick={myReceiveHandle} >{t('myReceiveText')}</a></li>
                            <li><a href="#" onClick={followManHandle} >{t('followManText')}</a></li>
                            <li><a href="#" onClick={myBookHandle} >{t('myBookText')}</a></li>
                        </>}
                    </ul>
                    {loginsiwe && actor?.actor_account &&<div>
                    <SearchInput setSearObj={setSearObj} setFindErr={setFindErr} actor={actor} t={t} />
                    {searObj && <div className='mt-3' >
                        <EnkiMember messageObj={searObj} isLocal={!!searObj.manager} />
                        <div className='mb-3 mt-3'>
                        {searObj.id>0?<EnKiUnFollow t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                        :<EnKiFollow  t={t} searObj={searObj} actor={actor} showTip={showTip} closeTip={closeTip} showClipError={showClipError} />
                        }
                        </div>
                    </div>
                    }
                    {findErr && <ShowErrorBar errStr={t('noFindText')} />}
                    </div>
                    }
                </div>
                <div className={iaddStyle.sccontent}>
                    {activeTab === 0 && <Main t={t} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab}
                        fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} />}

                    {activeTab === 1 && <MeCreate t={t} tc={tc} actor={actor} addCallBack={refreshCallBack}
                        currentObj={currentObj} afterEditCall={afterEditCall} setActiveTab={setActiveTab} />}

                    {activeTab === 2 && <MessagePage t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} domain={domain}
                        currentObj={currentObj} delCallBack={refreshCallBack} preEditCall={preEditCall} setActiveTab={setActiveTab} />}

                </div>
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
            }, locale, domain: process.env.LOCAL_DOMAIN,
        }
    }
}
