// import { Button, InputGroup, Card } from "react-bootstrap";
import Loadding from "../../../components/Loadding";
// import EnkiMessageCard from "../form/EnkiMessageCard";
import { useEffect, useState, useRef } from "react"
import { client } from "../../../lib/api/client";
import ShowErrorBar from "../../../components/ShowErrorBar";
import InfiniteScroll from 'react-infinite-scroll-component';
import Contentdiv from "./Contentdiv";

export default function Mainself({env,path,locale, t,fetchWhere, setFetchWhere,actor,setCurrentObj,setActiveTab }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");
    useEffect(()=>{
        if(fetchWhere.currentPageNum===0) setPageNum(0);
    },[fetchWhere])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            console.log(fetchWhere)
            if (fetchWhere.currentPageNum === 0) setData([]);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&menutype=${fetchWhere.menutype}&daoid=${fetchWhere.daoid}&actorid=${fetchWhere.actorid}&w=${fetchWhere.where}&order=${fetchWhere.order}&eventnum=${fetchWhere.eventnum}&account=${fetchWhere.account}&v=${fetchWhere.v}`, 'messagePageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setHasMore(res.data.length >= 12);
                        setPageNum((pageNum) => pageNum + 1)
                        if (fetchWhere.currentPageNum === 0) setData(res.data);
                        else setData([...data, ...res.data]);
                        setErr('');
                    } else { 
                        setHasMore(false); //读取错误，不再读
                        setErr(res?.data?.errMsg || "Failed to read data from the server");
                    }
                } else 
                {
                    setHasMore(false); //读取错误，不再读
                    setErr(res?.statusText || res?.data?.errMsg );
                }
            } catch (error) {
                console.error(error);
                setHasMore(false); //读取错误，不再读
                setErr(error?.message);
    
            } finally {
                setIsLoading(false);
            }
        };
        if(!isLoading ) {
            if(fetchWhere.menutype===3 && (fetchWhere.eventnum === 5 || fetchWhere.account))  fetchData(); //个人显示所有，或登录后显示所有
            else if (fetchWhere.menutype===1 && fetchWhere.daoid)  fetchData(); // 有我的注册dao集，才能获取 
            else if(fetchWhere.menutype===2) fetchData(); //公共社区直接获取
        }
    }, [fetchWhere]);


  const fetchMoreData = () => {
    // console.log("mess next------------>",fetchWhere)
    if(!isLoading && hasMore) setFetchWhere({ ...fetchWhere, currentPageNum: pageNum });
  };

    // const footerdiv=()=>{
    //     if(!isLoading){
    //         if(err) return <ShowErrorBar errStr={err} />
    //         if(Array.isArray(data) && data.length==0) return <div className="mt-3" >{t('noFounData')}</div>
    //         if(!hasMore) return <div style={{textAlign:'center'}} >---{t('emprtyData')}---</div>


    //     }else 
    //     {
    //         return <Loadding />
    //     }
    // }

    return (

        <div className='sccontent'>
        <div style={{margin:'0px', position:'sticky',top:'60px',padding:'10px',zIndex:256,backgroundColor:'#f4f4f4',borderTopLeftRadius:'6px',borderTopRightRadius:'6px'}} > 
            主页
        </div>

        <div>
        <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                >
                    {data.map((obj, idx) => (
                        <Contentdiv env={env} path={path}  locale={locale} messageObj={obj} key={`${idx}_${obj.id}`} t={t} actor={actor} setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} />
                    ))}
                </InfiniteScroll> 
        </div>
        <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                 {/* {footerdiv()} */}
        </div>
        </div>
    

    );
}

