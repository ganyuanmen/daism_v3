

import PageLayout from '../components/PageLayout';
import { client } from "../lib/api/client";
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl'
import ShowErrorBar from '../components/ShowErrorBar';
import Loginsign from '../components/Loginsign';
import Loadding from '../components/Loadding';

import { Card,Button, Alert } from 'react-bootstrap';
import { useState } from 'react';

//获取eth
export default function Transfer({locale,env}) {
    const [err,setErr]=useState('')
    const [mess,setMess]=useState('')
    const [loading,setLoading]=useState(false)
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    



    const send=async ()=>{

        setLoading(true)
        let res=await client.post('/api/transfer')
        setLoading(false)
        if(res.status===200) {
            if(res.data.errMsg) {
                setErr(res.data.errMsg)
                setMess('') 
            }else {
            setMess(res.data.hash)
            setErr('')
            }
        }else {
            setErr(res.statusText)
             setMess('')
        }

    }

  
    return (
        <PageLayout env={env}>

            <Card className='mt-3 mb-3' >
                <Card.Body>
                    <div className='mt-2 mb-2' >{user.connected<1 && <ShowErrorBar errStr={tc('noConnectText')}/>}</div>
                    
                    <div  className='mt-2 mb-2' >{user.connected===1 && <h3 > login :{user.account}</h3>}</div>
                    <div  className='mt-2 mb-2' >{!loginsiwe && user.connected===1 && <Loginsign user={user} tc={tc} />}</div>

                   {loading?<Loadding />: <Button onClick={send} disabled={!loginsiwe} > send me {env.networkName==='holesky'?'0.5':'0.2'} ETH</Button>}
           
                </Card.Body>
            </Card>

            <Card className='mt-3 mb-3' >
                <Card.Body>
                    {err && <Alert variant='danger'>{err}</Alert>}
                    {mess && <div >hash:{mess}</div>}
                </Card.Body>
            </Card>

            <Card className='mt-3 mb-3' >
                <Card.Body>
                <p> more test ETH in <a target="_blank" href={`https://${env.networkName}-faucet.pk910.de/`}>https://{env.networkName}-faucet.pk910.de</a> </p>
                </Card.Body>
            </Card>

           
          
        </PageLayout>
    )
}

    
export const getServerSideProps  = ({ locale }) => {
    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            },locale
            ,env:getEnv()
            }
        }
    }
  

  

  