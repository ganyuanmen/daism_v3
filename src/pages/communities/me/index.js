import { useTranslations } from 'next-intl'
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import PageLayout from '../../../components/PageLayout'
import EnkiMember from '../../../components/enki2/form/EnkiMember';
import EnkiAccount from '../../../components/enki2/form/EnkiAccount';
import Loginsign from '../../../components/Loginsign';
import { Nav } from 'react-bootstrap';
import Main from '../../../components/enki2/page/Main';
import MeCreate from '../../../components/enki2/page/MeCreate';
import MessagePage from '../../../components/enki2/page/MessagePage';

//
export default function me({ domain }) {
    const [fetchWhere, setFetchWhere] = useState({
        currentPageNum: 0,  //当前页
        daoid: '',  //此处不用
        actorid: 0, account: '',
        where: '', //查询条件
        sctype: '',
        order: 'reply_time', //排序
        eventnum: 1  //0 活动 1 非活动
    });

    const [currentObj, setCurrentObj] = useState(null);  //用户选择的发文对象
    const [activeTab, setActiveTab] = useState(0);

    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const actor = useSelector((state) => state.valueData.actor)  //siwe登录信息
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    
    useEffect(() => { if (actor?.actor_account) setFetchWhere({ ...fetchWhere, actorid: actor.id, account: actor.actor_account }) }, [actor])

    const handleSelect = (eventKey) => {
        switch (parseInt(eventKey)) {
            case 1:  //首页
                setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 1 })
                setActiveTab(0);
                break;
            case 2: //我的嗯文
                setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 2 })
                setActiveTab(0);
                break;
            case 3: //我的收藏
                setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 3 })
                setActiveTab(0);
                break;
            case 4: //我的接收嗯文
                setFetchWhere({ ...fetchWhere, currentPageNum: 0, eventnum: 4 })
                setActiveTab(0);
                break;
            case 5: //关注我的嗯人
                setActiveTab(1);
                break;
            case 6: //我关注的嗯人
                setActiveTab(1);
                break;
            case 9: //创建嗯文
                setCurrentObj(null)
                setActiveTab(1);
                break;

        }

    }
    const refreshCallBack = () => { setFetchWhere({ ...fetchWhere, currentPageNum: 0,eventnum:1 }); setActiveTab(0); } //刷新数据,从0页开始
    const preEditCall = () => { setActiveTab(1); } //修改前回调
    const afterEditCall = (obj) => { refreshCallBack() } //修改后回调

    return (
        <PageLayout>

            <div style={{ width: '100%' }} className="clearfix">
                <div className="scleft">
                    {actor?.actor_account ? <EnkiMember messageObj={actor} isLocal={true} hw={64} /> : <EnkiAccount t={t} />}
                    {!loginsiwe && <Loginsign user={user} tc={tc} />}
                    <div className='mt-3'>
                        <Nav onSelect={handleSelect} className="flex-column">
                            <Nav.Link eventKey="1">首页</Nav.Link>
                            {loginsiwe && actor.actor_account && <>
                                <Nav.Link eventKey="9">创建嗯文</Nav.Link>
                                <Nav.Link eventKey="2">我的嗯文</Nav.Link>
                                <Nav.Link eventKey="3">我的收藏</Nav.Link>
                                <Nav.Link eventKey="4">我的接收嗯文</Nav.Link>
                                <Nav.Link eventKey="5">关注我的嗯人</Nav.Link>
                                <Nav.Link eventKey="6">我关注的嗯人</Nav.Link></>}
                        </Nav>
                    </div>


                </div>
                <div className="scright">

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

export const getStaticProps = ({ locale }) => {

    return {
        props: {
            messages: {
                ...require(`../../../messages/shared/${locale}.json`),
                ...require(`../../../messages/federation/${locale}.json`),
            }, locale, domain: process.env.LOCAL_DOMAIN,
        }
    }
}

