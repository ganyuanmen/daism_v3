import { Button, InputGroup, Form } from "react-bootstrap";
import Loadding from "../../Loadding";
import EnkiMessageCard from "../form/EnkiMessageCard";
import { useEffect, useState, useRef } from "react"
import { client } from "../../../lib/api/client";

export default function Main({ t,fetchWhere, setFetchWhere, setCurrentObj, setActiveTab }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const searRef = useRef(null);

    useEffect(() => {
        console.log("=========>",fetchWhere)
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await client.get(`/api/getData?pi=${fetchWhere.currentPageNum}&sctype=${fetchWhere.sctype}&daoid=${fetchWhere.daoid}&actorid=${fetchWhere.actorid}&w=${fetchWhere.where}&order=${fetchWhere.order}&eventnum=${fetchWhere.eventnum}&account=${fetchWhere.account}`, 'messagePageData');
                console.log("mess data",res.data)
                setHasMore(res.data.length >= 12);
                if (fetchWhere.currentPageNum === 0) setData(res.data);
                else setData([...data, ...res.data]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (!isLoading) {
            if (fetchWhere.sctype) { //社区
                if (fetchWhere.daoid) fetchData();
            } else { //个人
                if (fetchWhere.eventnum === 1 || fetchWhere.account) fetchData();
            }
        }

    }, [fetchWhere]);


    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //         const scrollHeight = document.documentElement.scrollHeight;
    //         const clientHeight = document.documentElement.clientHeight;
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             console.log('mess滚动到底部了', [fetchWhere, hasMore]);
    //             if (hasMore) setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 });
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [fetchWhere, hasMore]);

    return (
        <>
            <div className="sctop" >
                <InputGroup className="mb-3">
                    <Form.Control ref={searRef} placeholder="Search..." onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setFetchWhere({ ...fetchWhere, currentPageNum: 0, where: e.target.value })
                        }
                    }}
                    />
                    <Button variant="outline-secondary" onClick={e => {
                        setFetchWhere({ ...fetchWhere, currentPageNum: 0, where: searRef.current.value })
                    }} > Search </Button>
                </InputGroup>
            </div>
            <div style={{ width: '100%' }} >
                {data.map((obj, idx) => <EnkiMessageCard setCurrentObj={setCurrentObj} setActiveTab={setActiveTab} messageObj={obj} key={`${idx}_${obj.id}`} t={t} />)}
            </div>
            <div className="mt-3 mb-3" style={{textAlign:'center'}}  >
                {isLoading?<Loadding />
                :<>
                    {hasMore?<Button size='sm' onClick={()=>setFetchWhere({ ...fetchWhere, currentPageNum: fetchWhere.currentPageNum + 1 })}  variant='light'>fetch more ...</Button>
                    :<p>没有更多数据了</p>
                    }
                </>
                }
            </div>


        </>

    );
}

