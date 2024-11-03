
import {Card,Tab,Tabs,Accordion } from 'react-bootstrap';
import withSession from '../../../lib/session';
import PageLayout from '../../../components/PageLayout';
import { useTranslations } from 'next-intl'
import DaoItem from '../../../components/federation/DaoItem';
import { getJsonArray } from '../../../lib/mysql/common';
import EnkiMember from '../../../components/enki2/form/EnkiMember'
import FollowItem0 from '../../../components/enki2/form/FollowItem0';
import FollowItem1 from '../../../components/enki2/form/FollowItem1';



//只显示个人帐号 daoinfo/[id]  显示组织帐号
//传递的是 a_account 的id 
export default function MyActor({daoActor,actor,follow0,follow1}) {
  let t = useTranslations('ff')

    return (
      <PageLayout>
        <Card className='daism-title mt-2'>
        <Card.Header>{t('myAccount')}</Card.Header>
        <Card.Body>
            <div className='d-flex justify-content-between align-items-center' >
              <EnkiMember messageObj={actor} isLocal={true} />
              {actor.dao_id>0?t('groupAccount'):t('selfAccount')}
            </div>
            <hr/>
            <div>
                <div className='mb-2' ><b>{t('persionInfomation')}:</b></div>
                <div dangerouslySetInnerHTML={{__html: actor.actor_desc}}></div>
            </div>
            <hr/>
            {actor.dao_id===0 &&
              <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header><b>{t('daoGroupText')}:</b></Accordion.Header>
                <Accordion.Body>
               {daoActor.map((obj)=>(<DaoItem key={obj.dao_id} t={t} record={obj} />))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            }
         
         
            <Tabs defaultActiveKey="follow0" className="mb-3 mt-3" >
            <Tab eventKey="follow0" title={`${t('followingText').replace('3',follow0.length)}`}>
              <div>
                {follow0.map((obj)=> <FollowItem0 key={obj.id}  messageObj={obj} t={t}  />)}
              </div>
            </Tab>
            <Tab eventKey="follow1" title={`${t('followedText').replace('3',follow1.length)}`}>
              <div>
                {follow1.map((obj)=> <FollowItem1 key={obj.id} messageObj={obj} t={t} />)}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
        </Card>
        </PageLayout>
    );
}

export const getServerSideProps = withSession(async ({locale,query }) => {
  const actor=await getJsonArray('actorbyid',[query.id],true)
  const daoActor=await getJsonArray('daoactorbyid',[query.id])
  const follow0=await getJsonArray('follow0',[actor?.actor_account])
  const follow1=await getJsonArray('follow1',[actor?.actor_account])
  
    return {
      props: {
        messages: {
          ...require(`../../../messages/shared/${locale}.json`),
          ...require(`../../../messages/federation/${locale}.json`),
        },
        daoActor,actor,follow0,follow1,locale
      }
    }
  }

)

  