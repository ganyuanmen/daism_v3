
import { Alert, Button } from 'react-bootstrap'


import { useDispatch,useSelector} from 'react-redux';
import PageLayout from '../components/PageLayout';
import {getEnv} from '../lib/utils/getEnv'
import Head from 'next/head';
import Wallet from '../components/Wallet';
import {setTipText,setMessageText} from '../data/valueData'

/**
 * IADD兑换
 */
export default function Honor({locale,env}) {

    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!actor?.actor_account && !actor.actor_account?.includes('@')){
      return showError(t('notRegisterEnki'))
    }
    if(actor.actor_account.split('@')[1]!=domain) {
      return showError(t('registerDomain',{domain}))
    }

    const formData = new FormData();
    formData.append('jsonFile', file);
    showTip(t('uploadingText'))
    const response = await fetch('/api/mastodon', {
      method: 'POST',
      // headers:{encType:'multipart/form-data'},
      body: formData,
    });
    closeTip()
    const data = await response.json();

    if (response.ok) {
      showError(`${data.msg}_*_`);
    } else {
      showError(data.errMsg);
    }
   
    setUpshow(false)
  };

  const click=async ()=>{
    showTip('正在创建荣誉通证，请稍候...')
    try {
      await window.daismDaoapi.Unft.mint();
      showError('荣誉通证创建成功_*_');
    } catch (err) {
      showError("错误："+(err.message ? err.message : err));
    }finally{
      closeTip()
    }
  }
   
    return (<>
      <Head>
            <title>中本聪 荣誉通证</title>
        </Head>
    
    
      <PageLayout env={env} >
   
        <div style={{textAlign:'center'}} className='mt-3' >
          <Wallet env={env} />
          <br/>
         <Button onClick={click} disabled={user.connected!=1}  >中本聪 荣誉通证</Button>
        
        </div>
        <Alert className='mt-3' >
            <ul>
              <li>连接钱包</li>
              <li>单击“中本聪 荣誉通证”按钮</li>
            </ul>

            每个地址只能mint 一次，mint 需要消耗0.02ETH 和当时的gas 费用。
        </Alert>

      </PageLayout>
      </>
    )
}

    
export const getServerSideProps  = async ({locale }) => {
    // const messages = await import(`../messages/shared/${locale}.json`);

    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            ...require(`../messages/iadd/${locale}.json`),
            },locale
            ,env:getEnv()
            }
        }
    }
  

  

  