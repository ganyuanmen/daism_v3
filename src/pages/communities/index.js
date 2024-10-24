import { useSelector,useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import { Container } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Main from '../../components/enki2/page/Main';
import EnkiCreateMessage from '../../components/enki2/page/EnkiCreateMessage';
import MessagePage from '../../components/enki2/page/MessagePage';
import EnkiTools from '../../components/enki2/form/EnkiTools'
import {setDaoList,setDaoFilter} from '../../data/valueData'
import { client } from '../../lib/api/client';
import SearchPage from '../../components/enki2/page/SearchPage';
import { useMessage } from '../../hooks/useMessageData';


export default function Federation() {  
	const [data,setData]=useState([]) //数据集合
	const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
	const [activeTab, setActiveTab] = useState(0);
	const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
	const [editCurrentObj, setEditCurrentObj] = useState(null);  //修改的发文对象
	const [refresh,setRefresh]=useState(false); 
  const [whereType,setWhereType]=useState(0) //查询条件，0 所有，1 活动发文 2 智能公器，3 我的收藏 4 我的发布
  const [v,setV]=useState(0) //查询附加条件
  const [daoObj,setDaoObj]=useState({}) //选择的智能公器对象
  const [searObj,setSearObj]=useState({}) //查找到的对象

  const [searAccount,setSearAccount]=useState('')

	const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
	const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
  const dispatch = useDispatch();

  const messageData = useMessage({account:searAccount, currentPageNum,refresh,whereType,v}) //分布获取发文记录
	const tc = useTranslations('Common')
	const t = useTranslations('ff')

	const mainCallBack=()=>{setData([]);setCurrentPageNum(1);setActiveTab(0);setRefresh(!refresh);setEditCurrentObj(null)} //刷新数据
	const preEditCall=()=>{setEditCurrentObj(currentObj);setActiveTab(1);} //修改前回调
  const afterEditCall=(obj)=>{setEditCurrentObj(null);setCurrentObj(obj);setActiveTab(2);setDaoObj({});} //修改后回调
  const createPost=()=>{setActiveTab(1);setCurrentObj(null);setEditCurrentObj(null);} //创建发文
  const searchCall=(obj)=>{setSearObj(obj); setActiveTab(3);setCurrentObj(null);setEditCurrentObj(null);setDaoObj({});} //查找后显示页面

  const homeCall=()=>{setCurrentPageNum(1); setWhereType(0);setActiveTab(0);setData([]);setRefresh(!refresh);setDaoObj({});setSearAccount('');setV(actor?.actor_account); } //主页过滤
  const eventFilter=()=>{setCurrentPageNum(1);setWhereType(1);setActiveTab(0);setData([]);setRefresh(!refresh);setDaoObj({});setSearAccount('');} //活动过滤
  const smartcommonClick=(obj)=>{setCurrentPageNum(1);setWhereType(2);setActiveTab(0);setV(obj.dao_id);setData([]);setRefresh(!refresh);setDaoObj(obj);setSearAccount(obj.actor_account);} //智能公器过滤选择
  const myBookFilter=()=>{setCurrentPageNum(1);setWhereType(3);setV(actor.id);setActiveTab(0);setData([]);setRefresh(!refresh);setDaoObj({});setSearAccount('');} //我的收藏
  const myFollowFilter=()=>{setCurrentPageNum(1);setWhereType(4);setActiveTab(0);setData([]);setRefresh(!refresh);setDaoObj({});setSearAccount('');} //我的发布

  useEffect(()=>{setData(data.concat(messageData.rows))},[messageData])  //发文数据追加
  useEffect(()=>{let a=window.location.hash.substring(1); setActiveTab(parseInt(a?a:0));},[setActiveTab])  //根据hash 显示选择项
  

  //下载所有已注册的smart common 用于过滤
  useEffect(() => {
    let ignore = false;
    client.get(`/api/getData`,'getAllSmartCommon').then(res =>{ 
      if (!ignore) if (res.status===200) {dispatch(setDaoList(res.data)); dispatch(setDaoFilter(res.data));}
      else console.error('getAllSmartCommon',res.statusText)
    });
    return () => {ignore = true}
  }, []);

  return (
      <PageLayout>
        <Container>
          <EnkiTools t={t} tc={tc} actor={actor} createPost={createPost} homeCall={homeCall} user={user} eventFilter={eventFilter} smartcommonClick={smartcommonClick} daoObj={daoObj} myBookFilter={myBookFilter} myFollowFilter={myFollowFilter} searchCall={searchCall} />
          {activeTab === 0 && <Main errors={messageData.error} total={messageData.total} status={messageData.status} t={t} tc={tc} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} data={data} setData={setData} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} />}
          {activeTab === 1 && <EnkiCreateMessage user={user} daoObj={daoObj} actor={actor} t={t} tc={tc} addCallBack={mainCallBack} currentObj={editCurrentObj}  afterEditCall={afterEditCall}/>}
          {activeTab === 2 && <MessagePage actor={actor} currentObj={currentObj}  t={t} tc={tc}  delCallBack={mainCallBack} preEditCall={preEditCall} setActiveTab={setActiveTab} />}   
          {activeTab === 3 && <SearchPage searObj={searObj} t={t} homeCall={homeCall} actor={actor} />}   
        </Container> 
      </PageLayout>
  );
}

export const getServerSideProps = async ({locale }) => {
    
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/federation/${locale}.json`),
          },locale
        }
      }
    }

  
    