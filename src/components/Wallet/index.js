import {useRef,useState,useEffect } from 'react';
import { Dropdown,Modal,Button } from 'react-bootstrap';
import DaoApi from '../../lib/contract';
import { ethers } from "ethers";
import ShowAddress from '../ShowAddress'
import User from './User';
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import {setEthBalance,setDaoActor,setActor,setUser,setTokenList,setTokenFilter,setLoginsiwe,setDaoAddress,setMessageText} from '../../data/valueData'
import { client } from '../../lib/api/client';
import LoginButton from '../LoginButton';
import { useSyncProviders } from '../../hooks/useSyncProviders'

/**
 * 钱包登录管理 
 */
function Wallet({env}) {
    const router = useRouter()
    const providers = useSyncProviders()
    const [showMetaMask, setShowMetaMask] = useState(false); //没安装metMASK提示
    const [connecting,setConnecting]=useState(false); //正在登录
    const providerRef=useRef(); //已选择的provider
    const connectWalletRef=useRef()  // 连接钱包接口
    const user = useSelector((state) => state.valueData.user)
    const loginsiwe = useSelector((state) => state.valueData.loginsiwe)
    const dispatch = useDispatch();
    function setEth(value){dispatch(setEthBalance(value))}
    const t = useTranslations('Common')
    const loginRef=useRef() //siwe 登录
    function showError(str){dispatch(setMessageText(str))}
    //new 合约对象条件
    const [daoLogin,setDaoLogin]=useState({account:'',signer:null,env})
    const NET={'_0xaa36a7':'sepolia','_0x4268':'holesky','_0x1':'mainnet','_11155111':'sepolia','_17000':'holesky',"_1":"mainnet"}

    useEffect(()=>{ //根据daoLogin 创建合约对象
        if(daoLogin.account && daoLogin.signer){
            window.daismDaoapi = new DaoApi(daoLogin.signer,daoLogin.account,env)
        }
        return ()=>{ window.daismDaoapi =null }
    },[daoLogin])

    useEffect(() => {
        if(providers.length) {
            let _name=window.sessionStorage.getItem("providerinfoname")
            if(_name){
                for(let i=0;i<providers.length;i++)
                {
                    if(_name===providers[i].info.name)
                    {
                        providerRef.current=providers[i]
                        break
                    }
                }
            }

            if(window.sessionStorage.getItem("isLogin")==='1') {  //恢复登录
                connectWalletRef.current(providerRef.current)
                if(window.sessionStorage.getItem("loginsiwe")==='1'){ // //恢复siwe 登录
                    dispatch(setLoginsiwe(true))
                    let _dao=window.sessionStorage.getItem("daoActor")
                    if(_dao) dispatch(setDaoActor(JSON.parse(_dao)))
                    let _actor=window.sessionStorage.getItem("actor")
                    if(_actor) dispatch(setActor(JSON.parse(_actor)))
                }
            }         
        }
    }, [providers]);  

    const onChaidChange=(provider)=>{
        provider.on('chainChanged', (_chainId,a,b,c)=>{
            console.log("chainChanged--->",_chainId)
            if(NET[`_${_chainId}`]!=env.networkName){
                showError(t('mustLoginText',{netName:env.networkName}));
                onDisconnect()
            }
            else { //切换成功之后，需要重新登录
                console.log("begin re connect.................")
                window.location.reload()       //0x1 //0xaa36a7  parseInt(chainIdHex)  parseInt('0xaa36a7')=11155111
            }
        });
    }
    
    const checkNetWork=(tempChainId)=>{
        if(NET[`_${tempChainId}`]!=env.networkName){
                showError(t('mustLoginText',{netName:env.networkName}));
                setConnecting(false);
                return false;
        }else {
            return true;
        }
    }
    const connectWallet=async(providerWithInfo)=>{//连接钱包
        providerRef.current=providerWithInfo    
        setConnecting(true);
        try{
            if(providerWithInfo) { //刷新登录
                const accounts = await providerWithInfo.provider.request({method: 'eth_requestAccounts' });
                let tempAccount=accounts?.[0];
                onChaidChange(providerWithInfo.provider);
                const provider = new ethers.BrowserProvider(providerWithInfo.provider);
                window.loginProvider=provider
                const signer =await provider.getSigner()
                window.daism_signer=signer
                const network=await provider.getNetwork()
                let tempChainId = network.chainId.toString()
                console.log("ok",JSON.stringify(network),NET[`_${tempChainId}`],env.networkName)
                if(!checkNetWork(tempChainId)) return;
              
                window.sessionStorage.setItem("providerinfoname", providerWithInfo.info.name)           
                dispatch(setUser({connected:1,account:tempAccount,networkName:network.name, chainId:tempChainId}))
                setDaoLogin({...daoLogin,account:tempAccount,signer:signer}); //创建合约对象
                provider.getBalance(tempAccount).then(_balance=>{setEth(ethers.formatEther(_balance))})
                if(router.pathname==='/' ) getTokens(tempAccount)
                providerWithInfo.provider.on('accountsChanged', _account=>{switchDisconnect(); window.location.reload();});
            }
            window.sessionStorage.setItem("isLogin", "1")
        }catch (err)
        {
            console.error(err)
        } finally{
            setConnecting(false);
        }
    }

    connectWalletRef.current=connectWallet

    function getTokens(did)
    {
        client.get(`/api/getData?did=${did}`,'getToekn').then(res =>{ 
            if(res.status===200) {
                dispatch(setTokenList(res.data))
                dispatch(setTokenFilter(res.data))
            }
            else console.error(res.statusText)
        })
    }

    //退出
    const onDisconnect = async () => {
        console.info("unconnect.........")
        fetch('/api/siwe/logout?')
        setEth('0')
        dispatch(setUser({...user,connected:0,account:'',chainId:0}))
        dispatch(setLoginsiwe(false))
        dispatch(setActor({}))
        dispatch(setDaoActor([]))
        window.sessionStorage.setItem("isLogin", "0")
        window.sessionStorage.setItem("loginsiwe", "0")
        window.sessionStorage.setItem("daoActor", '')
        window.sessionStorage.setItem("actor", '')
        window.sessionStorage.setItem("providerinfouuid", '')
        
        window.daismDaoapi=null
        if(router.pathname==='/') getTokens('')
    }

     //切换
     const switchDisconnect = async () => {   
        fetch('/api/siwe/logout?')
        dispatch(setLoginsiwe(false))
        dispatch(setActor(null))
        dispatch(setDaoActor(null))
        
        window.sessionStorage.setItem("loginsiwe", "0")
        window.sessionStorage.setItem("daoActor", '')
        window.sessionStorage.setItem("actor", '')
        window.daismDaoapi=null
    }

    return (
        <>
          <div>
              {user.connected >0 && <User t={t} loginsiwe={loginsiwe} disconnect={onDisconnect} user={user} />}
          </div>
          <div  style={{marginTop:'6px',marginRight:'10px'}}  >
            {user.connected >0?<ShowAddress  address={daoLogin.account} ></ShowAddress>
           :providers.length > 0?
            <Dropdown>
                <Dropdown.Toggle style={{borderRadius:'12px !important',marginLeft:'16px !important'}} variant="primary" size="sm" disabled={connecting}  id="dropdown-basic">
                    <img alt=""  src='/wallet.svg' width={18} height={18} /> 
                    <span> {connecting?t('connectingText'): t('connectText')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
               {providers?.map((provider) => (
                     <Dropdown.Item href="#" key={provider.info.uuid} onClick={() => connectWallet(provider)}><span className='daism-color' >
                         <img src={provider.info.icon} alt={provider.info.name}  width={24} height={24} />
                         </span> {provider.info.name}
                     </Dropdown.Item>
                 ))
                 }
                </Dropdown.Menu>
            </Dropdown>
            : <Button style={{borderRadius:'12px !important',marginLeft:'16px !important'}} variant="primary" size="sm" 
               onClick={e=>{setShowMetaMask(true)}} >
               <img alt="" style={{color:'red'}} src='/wallet.svg' width={18} height={18} /> {'  '}
               {t('connectText')}
           </Button> 
   

            }
          </div> 
                  
          {/* 安装metmask提示窗口 */}
          <Modal centered show={showMetaMask}  onHide={e=>{setShowMetaMask(false)}}>
          <Modal.Header closeButton>
            <Modal.Title>{t('tipText')}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='daism-tip-body' > 
             <img alt="" src="/mess.svg" width={32} height={32} />
            <div className='daism-tip-text'>
                <div>
                    {t('metmaskTip1')} {'  '}
                    <a href='https://metamask.io' target='_blank'  rel="noreferrer"  alt="metamask" >https://metamask.io</a>
                </div>
                <div>  {t('metmaskTip2')}</div>
            </div>
          </Modal.Body>
          </Modal>
          <LoginButton  ref={loginRef} command={true} />
        </>
    );
}

export default Wallet;