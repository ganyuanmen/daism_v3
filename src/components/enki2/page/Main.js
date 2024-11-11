import { Button, InputGroup, Form } from "react-bootstrap";
import Loadding from "../../Loadding";
import EnkiMessageCard from "../form/EnkiMessageCard";
import { useEffect, useState, useRef } from "react"
import { client } from "../../../lib/api/client";
import CommunitySerach from "../../enki3/CommunitySerach";
import ShowErrorBar from "../../ShowErrorBar";



export default function Main({ t,fetchWhere, setFetchWhere, setCurrentObj, setActiveTab }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [err,setErr]=useState("");

    

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&menutype=${fetchWhere.menutype}&daoid=${fetchWhere.daoid}&actorid=${fetchWhere.actorid}&w=${fetchWhere.where}&order=${fetchWhere.order}&eventnum=${fetchWhere.eventnum}&account=${fetchWhere.account}&v=${fetchWhere.v}`, 'messagePageData');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                        setHasMore(res.data.length >= 12);
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
        if(fetchWhere.menutype===3 && (fetchWhere.eventnum === 1 || fetchWhere.account))  fetchData(); //个人显示所有，或登录后显示所有
        else if (fetchWhere.menutype===1 && fetchWhere.daoid)  fetchData(); // 有我的注册dao集，才能获取 
        else if(fetchWhere.menutype===2) fetchData(); //公共社区直接获取
    }, [fetchWhere]);


    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //         const scrollHeight = document.documentElement.scrollHeight;
    //         const clientHeight = document.documentElement.clientHeight;
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             if (hasMore) setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 });
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [fetchWhere, hasMore]);

    const footerdiv=()=>{
        if(!isLoading){
            if(err) return <ShowErrorBar errStr={err} />
            else if(Array.isArray(data) && data.length==0) return <h3 className="mt-3" >{t('emprtyData')}</h3>
            else if(hasMore) <Button onClick={()=>setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 })} variant='light'>fetch more ...</Button>
        }
    }

    return (
        <>
            <CommunitySerach searchPlace='Search...' setFetchWhere={setFetchWhere} fetchWhere={fetchWhere} />
            <div style={{ width: '100%' }} >
                {isLoading?<Loadding /> : Array.isArray(data) && data.map((obj, idx) => <EnkiMessageCard setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} messageObj={obj} key={`${idx}_${obj.id}`} t={t} />)}
            </div>
            <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                {footerdiv()}
            </div>
        </>

    );
}

