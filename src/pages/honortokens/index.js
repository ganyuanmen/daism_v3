
import { useSelector,useDispatch } from 'react-redux';
import ShowErrorBar from '../../components/ShowErrorBar';
import PageLayout from '../../components/PageLayout';
import { useTranslations } from 'next-intl'
import Mynft from '../../components/nft/mynft'
import {setTipText,setMessageText} from '../../data/valueData'


export default function NFT() {
    const t = useTranslations('nft')
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    return (
        <PageLayout>
          <div style={{marginTop:'10px'}} >
            {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')}></ShowErrorBar>
            :<Mynft user={user} t={t} tc={tc} showError={showError} closeTip={closeTip} showTip={showTip} />
            }  
        </div>
        </PageLayout>
    );
}



export const getStaticProps = ({locale }) => {  
    
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/nft/${locale}.json`),
        //   ...require(`../../messages/federation/${locale}.json`),
        },locale
      }
    }
  }

    
