// import { IntlProvider } from 'next-intl'
 import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
//  import '../styles/globals_test.css'
import Head from 'next/head';
import store from '../lib/store'
import { Provider } from 'react-redux';
// import { useRouter } from 'next/router'

// export default function App({ Component, pageProps }) {
//   const { locale } = useRouter()

//   return (
//   <>
//     <Head>
//       <title>{pageProps.messages?.Common?.title}</title>
//       <link rel="preconnect" href={`https://daism.io/${locale}`}></link>
//       <meta name="description" content={pageProps.messages?.Common?.titleDesc} />
//     </Head>
//     <Provider store={store}>
//       {/* <NextIntlProvider messages={pageProps.messages}>
//         <Component {...pageProps} />
//       </NextIntlProvider> */}

// <IntlProvider messages={pageProps.messages} locale={pageProps.locale}>
//       <Component {...pageProps} />
//     </IntlProvider>
//     </Provider>
//   </>
//   )
// }


import { IntlProvider } from 'next-intl';

export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
       <title>{pageProps.messages?.Common?.title}</title>
       <link rel="preconnect" href={`https://daism.io/${pageProps.locale}`}></link>
       <meta name="description" content={pageProps.messages?.Common?.titleDesc} />
      </Head>
   
    <Provider store={store}>
    <IntlProvider messages={pageProps.messages} locale={pageProps.locale}>
      <Component {...pageProps} />
    </IntlProvider>
    </Provider>
    </>
  );
}


