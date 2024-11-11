import { useTranslations } from 'next-intl'
import { useState,useEffect } from "react"
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
import FollowCollection from '../../../components/enki3/FollowCollection';
import { getEnv,decrypt } from '../../../lib/utils/getEnv';
import { getOne } from '../../../lib/mysql/message';
import Head from 'next/head';
/**
 * 个人社区
 */
export default function me({openObj,env,locale }) {
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
    const [followMethod,setFollowMethod]=useState('getFollow0') //默认显示我关注谁
    const [searObj,setSearObj]=useState(null) //查找到帐号的对象
    const [findErr,setFindErr]=useState(false) //搜索帐号没找到

    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe) //是否签名登录

    const dispatch = useDispatch();
    function showTip(str) { dispatch(setTipText(str)) }
    function closeTip() { dispatch(setTipText('')) }
    function showClipError(str) { dispatch(setMessageText(str)) }
    const tc = useTranslations('Common')
    const t = useTranslations('ff')

    function removeUrlParams() {
        setCurrentObj(null);
        if(window.location.href.includes('?d=')) {
            const url = new URL(window.location.href);
            url.search = ''; // 清空所有参数
            window.history.replaceState({}, '', url.href);
        }
      }

      useEffect(()=>{ 
        if(openObj.id){
            setCurrentObj(openObj);
            setActiveTab(2);
        } 
    },[openObj])
    const homeHandle=()=>{ //首页
         //account: '' 从本地读取
         removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 1,account: '' })
        setActiveTab(0);
    }

    const createHandle=()=>{ //创建发文
        removeUrlParams()
        const [name,localdomain]=actor.actor_account.split('@');
        if(env.domain!==localdomain) return showClipError(t('loginDomainText',{domain:localdomain}));
        setCurrentObj(null);
        setActiveTab(1);
    }

    const myPostHandle=()=>{ //我的发文
        //account: '' 从源地读取
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2,account: actor?.actor_account })
        setActiveTab(0);
    }
 
    const myReceiveHandle=()=>{ //接收到的发文
            //account: '' 从源地读取
            removeUrlParams()
            setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 4,account: actor?.actor_account })
            setActiveTab(0);
    }

    const followManHandle0=()=>{ //我关注谁
        removeUrlParams()
        setFollowMethod('getFollow0');
        setActiveTab(3);
    }

    
    const followManHandle1=()=>{ //谁关注我
        removeUrlParams()
        setFollowMethod("getFollow1");
        setActiveTab(3);
    }

    const myBookHandle=()=>{ //我的书签
        removeUrlParams()
        setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 3,actorid:actor?.id,account: actor?.actor_account })
        setActiveTab(0);
    }
    
    //首页刷新数据 直接跳到我的发文
    // const refreshCallBack = () => { setFetchWhere({ ...fetchWhere, currentPageNum: 0,eventnum:2 }); setActiveTab(0); } 
    const preEditCall = () => { setActiveTab(1); } //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调

    return (<>
        <Head>
            <title>{currentObj?.id?currentObj?.title:tc('enkiTitle')}</title>
        </Head>
        <PageLayout env={env}>

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
                            <li><a href="#" onClick={myBookHandle} >{t('myBookText')}</a></li>
                            <li><a href="#" onClick={followManHandle0} >{t('followManText0')}</a></li>
                            <li><a href="#" onClick={followManHandle1} >{t('followManText1')}</a></li>
                            
                        </>}
                    </ul>
                    {loginsiwe && actor?.actor_account?.includes('@') && env.domain===actor.actor_account.split('@')[1] && <div>
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
                    {activeTab === 0 && <Main env={env} locale={locale} path="enkier" t={t} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab}
                        fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} />}

                    {activeTab === 1 && <MeCreate t={t} tc={tc} actor={actor} addCallBack={myPostHandle}
                        currentObj={currentObj} afterEditCall={afterEditCall} setActiveTab={setActiveTab} />}

                    {activeTab === 2 && <MessagePage  path="enkier" locale={locale} t={t} tc={tc} actor={actor} loginsiwe={loginsiwe} env={env}
                        currentObj={currentObj} delCallBack={myPostHandle} preEditCall={preEditCall} setActiveTab={setActiveTab} />}

                    {activeTab===3 && <FollowCollection t={t} account={actor?.actor_account} method={followMethod} domain={env.domain} />}
                </div>
            </div>

        </PageLayout></>
    )
}


export const getServerSideProps = async ({ locale,query }) => {
    let openObj={}; 
    const env=getEnv();
    if(query.d){
        const [id,daoid,domain]=decrypt(query.d).split(',');
        const sctype=parseInt(daoid)>0?'sc':'';
        if(domain==env.domain){
            openObj=await getOne(id,sctype)
        }
        else 
        {
            let response=await httpGet(`https://${domain}/api/getData?id=${id}&sctype=${sctype}`,{'Content-Type': 'application/json',method:'getOne'})
            if(response?.message) openObj=response.message
        }
        
    }
    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale
            ,env,openObj
        }
    }
}

