import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import Loginsign from '../../../components/Loginsign';
import Main from '../../../components/enki2/page/Main';
import EnkiCreateMessage from '../../../components/enki2/page/EnkiCreateMessage';
import MessagePage from '../../../components/enki2/page/MessagePage';
import { Button } from "react-bootstrap";
import Loadding from '../../../components/Loadding';
import iaddStyle from '../../../styles/iadd.module.css'
import { client } from '../../../lib/api/client';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';

export default function SC({ domain }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  ///当前页
        daoid: '0',  //0 所有, 数字 单个
        actorid: 1, 
        account: '',  //所有时为空，表示从当前服务下载，单个时为公器的帐号，
        where: '', //查询条件
        menutype: 2, 
        order: 'reply_time', //排序
        eventnum: 0  //0 活动 1 非活动
     });

     const [daoWhere,setDaoWhere]=useState({currentPageNum:0,where:''}); //dao 下载

     const [data, setData] = useState([]);
     const [isLoading, setIsLoading] = useState(false);
     const [hasMore, setHasMore] = useState(true);

    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);

    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    // const [daoData, setDaoData] = useState([]) //所属个人的社区列表

    useEffect(() => {
        // console.log("dao=========>",daoWhere)
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${daoWhere.currentPageNum}&w=${daoWhere.where}`, 'daoPageData');
                // console.log("dao data",res.data)
                setHasMore(res.data.length >= 10);
                if (fetchWhere.currentPageNum === 0) setData(res.data);
                else setData([...data, ...res.data]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData(); 
    }, [daoWhere]);

    const refreshCallBack = () => { setFetchWhere({ ...fetchWhere, currentPageNum: 0,eventnum:0 }); setActiveTab(0); } //刷新数据,从0页开始
    const preEditCall = () => { setActiveTab(1); } //修改前回调
    const afterEditCall=(obj)=>{setCurrentObj(obj);setActiveTab(2);} //修改后回调

    const latestHandle=()=>{
        //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:'',eventnum:0,where:'',daoid:0,v:0})
        setActiveTab(0);
    }

    const eventHandle=()=>{
        //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:'',eventnum:1,where:'',daoid:0,v:0})
        setActiveTab(0);
    }

    const myFollowHandle=()=>{
        //account: '' 从本地读取
        setFetchWhere({ ...fetchWhere, currentPageNum:0,account:actor?.actor_account,eventnum:0,where:'',daoid:0,v:1})
        setActiveTab(0);
    }
  
    return (
        <PageLayout>

            <div className={iaddStyle.clearfix}>
                <div className={iaddStyle.scsidebar}>
                    <div className='mb-3' >
                        {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} hw={64} /> : <EnkiAccount t={t} />}
                        {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    </div>
                 
                    <div className="d-flex mt-3 mb-2" style={{paddingLeft:'16px',paddingRight:'6px'}}  >
                        <img alt="" width={20} height={20} className={iaddStyle.iadd_find_img} src="/find.svg" />
                        <input autoComplete="off" className={`form-control ${iaddStyle.iadd_find_input}`} 
                        placeholder={t('searchText')} onChange={
                            e=>{
                                let v=e.currentTarget.value.toLowerCase().trim();
                                setDaoWhere({...daoWhere,where:v,currentPageNum:0})
                            }
                        }  />
                    </div>

                    <ul >
                        <li><a href="#" onClick={latestHandle} >{t('latestText')}</a></li>
                        <li><a href="#" onClick={eventHandle} >{t('eventText')}</a></li>
                        {actor?.actor_account && <li><a href="#" onClick={myFollowHandle}>{t('followCommunity')}</a></li>} 
                        {Array.isArray(data) && data.map((obj, idx) => <li key={obj.dao_id} className={iaddStyle.scli}>
                            <a href="#" onClick={e=>{setFetchWhere({...fetchWhere,daoid:obj.dao_id,currentPageNum:0,where:'',eventnum:0,v:0,account:obj.actor_account})}} >
                                <div style={{overflow:'hidden',display:'flex',alignItems:'center'}}>
                                <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} style={{marginRight:'10px'}} />{obj.actor_account}
                                </div>
                            </a>
                            </li>)
                        }
                    </ul>
                    <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                            {isLoading?<Loadding />
                                : hasMore && <Button  onClick={()=>setDaoWhere({ ...daoWhere, currentPageNum: daoWhere.currentPageNum + 1 })}  variant='light'>fetch more ...</Button>
                            }
                    </div>
                 
                </div>

                <div className={iaddStyle.sccontent}>

                    {activeTab === 0 && <Main t={t} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} fetchWhere={fetchWhere} setFetchWhere={setFetchWhere} />}
                    {activeTab === 1 && <EnkiCreateMessage domain={domain} actor={actor} t={t} tc={tc} currentObj={currentObj} afterEditCall={afterEditCall} />}
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
            }, locale, domain: process.env.LOCAL_DOMAIN
        }
    }
}



