
import { useTranslations } from 'next-intl'
import Rmenu from '../../components/Rmenu'
import MessagePage from '../../components/enki2/page/MessagePage';
import { getOne } from '../../lib/mysql/message';

//其它转过来的查看
export default function Message({currentObj}) {
  let t = useTranslations('ff')
 
    return (
      <Rmenu>
          <MessagePage t={t} currentObj={currentObj} />
        </Rmenu>
    );
}

export const getServerSideProps =async ({locale,query }) => {

  const currentObj=await getOne(query.id)
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/federation/${locale}.json`),
        },
        currentObj,locale
      }
    }
  }



  