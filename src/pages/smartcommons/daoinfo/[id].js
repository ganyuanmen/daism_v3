
import { useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import ShowErrorBar from '../../../components/ShowErrorBar';
import { useTranslations } from 'next-intl'
import { getJsonArray } from '../../../lib/mysql/common';
import PageLayout from '../../../components/PageLayout';
import DaoInfo_div from '../../../components/federation/DaoInfo_div';
import Daomember_div from '../../../components/federation/Daomember_div';
import Follower_div from '../../../components/federation/Follower_div';
import Domain_div from '../../../components/federation/Domain_div';

//只 显示组织帐号 actor/[id] 显示个人帐号 
export default function DaoInfo({daoData,daoMember,follower,domain,accountTotal}) {
    // const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const daoActor=useSelector((state) => state.valueData.daoActor)
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    // const user = useSelector((state) => state.valueData.user)

    const [member,setMember]=useState([])
    const [follow,setFollow]=useState([])

    useEffect(()=>{ setMember(daoMember) },[daoMember])
    useEffect(()=>{ setFollow(follower) },[follower])
    

    return (
        <PageLayout>
            <div style={{marginTop:'10px'}} >
                  { daoData.dao_id?<>
                    <Domain_div record={daoData} daoActor={daoActor}  domain={domain} tc={tc} accountTotal={accountTotal} t={t}/>
                    <DaoInfo_div record={daoData} t={t} />
                    {daoData && member && member.length>0 &&  <Daomember_div record={member} t={t} dao_manager={daoData.dao_manager}/>}
                    {follow && follow.length>0 &&  <Follower_div record={follow} t={t} />}

                  </>
                :<ShowErrorBar errStr={tc('noDataText')} />}   
              </div>
        </PageLayout>
    );
}

export const getServerSideProps = async ({ locale,query }) => {
    
    const daoid=query.id

      return {
        props: {
          messages: {
            ...require(`../../../messages/shared/${locale}.json`),
            ...require(`../../../messages/federation/${locale}.json`),
          },
          domain:process.env.LOCAL_DOMAIN,
          daoData:await getJsonArray("daodatabyid",[daoid],true),
          daoMember:await getJsonArray('daomember',[daoid]),
          follower:await getJsonArray('fllower',[daoid]),
          accountTotal:process.env.SMART_COMMONS_COUNT,locale
        }
      }
    }
  
