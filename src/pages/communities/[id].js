
import { useTranslations } from 'next-intl'
import Rmenu from '../../components/Rmenu'
import MessagePage from '../../components/enki2/page/MessagePage';
import { getOne } from '../../lib/mysql/message';
import ShowErrorBar from '../../components/ShowErrorBar';
import Head from 'next/head';
import {useRouter} from 'next/router';

//其它转过来的查看
export default function Message({currentObj,domain}) {
  const router = useRouter();

  let t = useTranslations('ff')
  
    return (
      <>
    
        <Head>
        <meta content={`${currentObj.actor_name} (${currentObj.actor_account})`} property="og:title" />
        <meta content={`https://${domain}${router.asPath}`} property="og:url" />
        <meta content={new Date().toISOString()} property="og:published_time" />
        <meta content={currentObj.actor_account} property="profile:username" />
        <meta content={currentObj.title} name='description' />
        <meta content={currentObj.title} property="og:description" />
        <meta content="summary" property="twitter:card"/>
        <meta content={currentObj.top_img}  property="og:image" />
      </Head>
    
      <Rmenu>
        {currentObj?.id? <MessagePage t={t} currentObj={currentObj} />
        :<ShowErrorBar errStr={t('noPostingText')} />
        }
        </Rmenu>
        </>
    );
}

export const getServerSideProps =async ({locale,query }) => {
// console.log(req.headers)
  const currentObj=await getOne(query.id)
  

    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/federation/${locale}.json`),
        },
        currentObj,locale,domain:process.env.LOCAL_DOMAIN
      }
    }
  }



  