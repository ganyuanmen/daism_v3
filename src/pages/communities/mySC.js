import { useSelector} from 'react-redux';
import Wecome from '../../components/federation/Wecome';
import ShowErrorBar from '../../components/ShowErrorBar';
import { Card } from 'react-bootstrap';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import DaoItem from '../../components/federation/DaoItem'
import CreateDao from '../../components/my/CreateDao';
//我的smart common

export default function MyDao() {  
    const tc = useTranslations('Common')
    const t = useTranslations('ff')
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    const daoActor = useSelector((state) => state.valueData.daoActor)  //dao社交帐号列表
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const setRefresh=()=>{}

    const getDaoList=data=>{
        return <>
              <CreateDao setRefresh={setRefresh} />
              <Card className='daism-title mt-2'>
                <Card.Header>{t('daoGroupText')}</Card.Header>
                <Card.Body>
                    { data.map(obj=><DaoItem record={obj} t={t} key={obj.dao_id} />)}
                </Card.Body>
                </Card>   
            </>    
    }
    
    return (
        <PageLayout>
        {
          user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
          :<>
            {loginsiwe?<>
              {(daoActor && daoActor.length)?getDaoList(daoActor):<ShowErrorBar errStr={t('noDaoMemberText')} />}
              </>:<Wecome />
            }
          </>
        }
        </PageLayout>
    );
}

export const getStaticProps = ({locale }) => {
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/federation/${locale}.json`),
            ...require(`../../messages/my/${locale}.json`),
          },locale
        }
      }
    }
  