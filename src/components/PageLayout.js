import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Navbar,Container,Nav } from 'react-bootstrap'
import Wallet from './Wallet'
import Loddingwin from '../components/Loddingwin'
import ShowTip from '../components/ShowTip'
import { useSelector } from 'react-redux';

// import { MetaMaskProvider } from "@metamask/sdk-react";

export default function PageLayout({children}) {

  const t = useTranslations('Navigation')
  const { locale, locales, route,query } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)
  const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  const path=`${route}${restoredURL.length>1?restoredURL:''}`
  const tc = useTranslations('Common')
  const daoAddress=useSelector((state) => state.valueData.daoAddress)
  
  return (
    <>
  
    <Container className="daism-body"  >
       <Navbar collapseOnSelect expand="lg" className='pnavbar'>
        <Container className='pmenu' >
            <Navbar.Brand href={locale==='en'?'/':`/${locale}`}>
            <img src="/logo.svg"  alt="daism Logo"  width={32} height={32}   />
            </Navbar.Brand>
            <Navbar.Toggle  />
            <Navbar.Collapse >
                <Nav style={{width:'100%'}} className="d-flex align-items-center p-0 m-0 ">
                  <Link className={route === '/' ? 'pnavactive'  : ''}  href="/">{t('iadd')}</Link>
                  <Link className={route === '/smartcommons' ? 'pnavactive' : ''}  href="/smartcommons">{t('home')}</Link> 
                  <Link className={route === '/communities' ? 'pnavactive'  : ''}  href="/communities">{t('info')}</Link> 
                  <Link className={route === '/honortokens' ? 'pnavactive'  : ''}  href="/honortokens">{t('nft')}</Link> 
                  <Link className={route === '/workroom' ? 'pnavactive'  : ''}  href="/workroom">{t('my')}</Link>
                  
                  <a className={route === '/docs' ? 'pnavactive'  : ''} target='_blank' href={locale==='en'?"https://learn.daism.io/docs.html":"https://learn.daism.io/zh/docs.html"}>{t('doc')}</a> 
                  <a className={route === '/daism' ? 'pnavactive'  : ''} target='_blank'  href={locale==='en'?"https://learn.daism.io":"https://learn.daism.io/zh"} >{t('daism')}</a>  
                  <div style={{flex:'1',textAlign:'center',fontSize:'20px'}} ><strong>{daoAddress['networkName']}</strong></div>
                 <Wallet /> 
                 

                <div className='wlanguage' >
                      <Link  href={path} locale={otherLocale}>
                        {t('switchLocale', { locale: otherLocale })}
                  </Link>
                  </div>
          
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <Container className="daism-content" >
            {children}
        </Container>
        </Container>
        <footer className="d-flex justify-content-center daism-foot align-items-center flex-column  " style={{height:'120px',marginTop:'20px'}} >
            <div className="fs-4 mb-2"><strong> DAism.io</strong></div>
            <div className="fs-5">{tc('footerText')}</div>  
          
        </footer>
        <Loddingwin />
        <ShowTip />
    </>
  )
}
