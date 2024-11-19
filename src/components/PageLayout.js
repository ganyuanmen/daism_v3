import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Navbar,Container,Nav,NavDropdown, Alert } from 'react-bootstrap'
import Wallet from './Wallet'
import Loddingwin from './Loddingwin'
import ShowTip from './ShowTip'
import React, { useState } from 'react';

export default function PageLayout({children,env}) {

  const t = useTranslations('Navigation')
  const { locale, locales, route,query } = useRouter()
  const [showAlert, setShowAlert] = useState(true);
  const otherLocale = locales?.find((cur) => cur !== locale)
  const restoredURL = `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  const path=`${route}${restoredURL.length>1?restoredURL:''}`
  const tc = useTranslations('Common')
  const handleCloseAlert=()=>{ setShowAlert(false);}
  return (
    <>
  
    <Container className="daism-body" style={{paddingTop:'50px'}}    >
       <Navbar collapseOnSelect expand="lg"   className='pnavbar'>
        <Container className='pmenu' style={{position:'fixed',top:0,width:'100%',zIndex:1000}}  >
            <Navbar.Brand href={locale!='zh'?'/':`/${locale}`}>
            <img src="/logo.svg"  alt="daism Logo"  width={32} height={32}   />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={{width:'100%'}} className="d-flex align-items-center p-0 m-0 ">
                  <Nav.Link className={route === '/'  ? 'pnavactive'  : ''}  href={`/${locale!='zh'?'':'zh'}`}>{t('iadd')}</Nav.Link>
                  <Nav.Link className={route === '/smartcommons' ? 'pnavactive' : ''} href={`${locale!='zh'?'':'/zh'}/smartcommons`}>{t('home')}</Nav.Link> 
                  <Nav.Link className={route === '/honortokens' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/honortokens`} >{t('nft')}</Nav.Link> 
                  <Nav.Link className={route === '/workroom' ? 'pnavactive'  : ''}  href={`${locale!='zh'?'':'/zh'}/workroom`} >{t('my')}</Nav.Link>
                 
                  <NavDropdown className={route.startsWith('/communities') ? 'pnavactive'  : ''} title={t('social')} id="basic-nav-dropdown1">   
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/enki' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/enki`} > {t('myCommunity')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/SC' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/SC`} > {t('publicCommunities')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} className={route === '/communities/enkier' ? 'pnavactive'  : ''} href={`${locale!='zh'?'':'/zh'}/communities/enkier`} > {t('personalSocial')}</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title={t('college')} id="basic-nav-dropdown2">
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale!='zh'?"https://learn.daism.io":"https://learn.daism.io/zh"}>{t('daism')}</NavDropdown.Item>
                    <NavDropdown.Item style={{paddingLeft:'20px'}} target='_blank' href={locale!='zh'?"https://learn.daism.io/docs.html":"https://learn.daism.io/zh/docs.html"}>{t('doc')}</NavDropdown.Item>
                  </NavDropdown>

                  <div style={{flex:'1',textAlign:'center',fontSize:'20px'}} ><strong>{env.networkName}</strong></div>
                 <Wallet env={env} /> 

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
       {!route.startsWith('/communities') && <footer className="d-flex justify-content-center daism-foot align-items-center flex-column  " style={{height:'120px',marginTop:'20px'}} >
            <div className="fs-4 mb-2"><strong> DAism.io</strong></div>
            <div className="fs-5">{tc('footerText')}</div>  
          
        </footer>
        }   

      {showAlert && <Alert className='utofont' style={{textAlign:'center',position:'fixed',bottom:'-16px',right:'2px',zIndex:9876}} >
          {locale==='zh'?<>
            <span>总量1.15792x10</span><sup>69</sup><span> UTO 的 </span><strong>Satoshi UTO Fund</strong><span> 于2024年11月21日问世！</span>
          </>:<>
          <strong>Satoshi UTO Fund</strong><span>, with a total of 1.15792x10</span><sup >69</sup><span> UTO, was launched on October 21, 2024!</span>
          </>}
          {'  '}
          <button type="button" className="close" onClick={handleCloseAlert} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </Alert>  
      }
        <Loddingwin />
        <ShowTip />
    </>
  )
}
