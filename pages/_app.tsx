'use client';
import Head from 'next/head'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '@mui/material/styles'
//import { FirebaseAppProvider } from 'reactfire'
// @ts-ignore
const FirebaseAppProvider = dynamic(() => import('../lib/firebase').then(mod => mod.FirebaseAppProviderWrapper));
// @ts-ignore
const RecoilRoot = dynamic(() => import('recoil').then(mod => mod.RecoilRoot))
// @ts-ignore
const PageViewLogger = dynamic(() => import('../components/pageviewlogger').then(mod => mod.PageViewLogger))
//import Layout from '../components/layout'
// eslint-disable-next-line react/display-name
const Layout = dynamic(() => import('../components/layout'))
import { useTheme } from '../lib/theme'

import 'normalize.css/normalize.css'
//import '@exampledev/new.css/new.css'
import '../styles/new.css';
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'
import 'nprogress/nprogress.css'
import '../styles/nprogress-custom.scss'
import '../styles/globals.scss'
import '../styles/colors.scss'
import '../styles/syntax-highlighting.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  return (
    <>
      <Head>
        {/* Core */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        {/* Iconography */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        {/* Verification */}
        <meta name="google-site-verification" content="6Ci3V-jOwFCqFvntbRrkdoxF7MB4DC5gI_wWNz9fNTI" />
        {/* SEO */}
        <title>CougarGrades.io: Grade distribution data for UH</title>
        <meta name="description" content="Analyze grade distribution data for any past University of Houston course. Compare past instructors, compare multiple courses. Open source data and code." />
        {/* SEO - Open Graph (https://ogp.me/) */}
        {/* <meta property="og:title" content="Title Here" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="http://www.example.com/" />
        <meta property="og:image" content="http://example.com/image.jpg" />
        <meta property="og:description" content="Description Here" />
        <meta property="og:site_name" content="Site Name, i.e. Moz" />
        <meta property="article:published_time" content="2013-09-17T05:59:00+01:00" />
        <meta property="article:modified_time" content="2013-09-16T19:08:47+01:00" />
        <meta property="article:section" content="Article Section" />
        <meta property="article:tag" content="Article Tag" />
        <meta property="fb:admins" content="Facebook numberic ID" /> */}
        {/* SEO - Twitter */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@publisher_handle" />
        <meta name="twitter:title" content="Page Title" />
        <meta name="twitter:description" content="Page description less than 200 characters" />
        <meta name="twitter:creator" content="@author_handle" />
        <meta name="twitter:image:src" content="http://www.example.com/image.jpg" />  */}
        {/* Disable DarkReader as we're already dark-mode friendly */}
        <meta name="color-scheme" content="light dark" />
        <meta name="darkreader-lock" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* @ts-ignore */}
        <RecoilRoot>
          <SWRConfig value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
          }}>
            <FirebaseAppProvider>
              {/* <RealtimeClaimUpdater /> */}
              <PageViewLogger />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </FirebaseAppProvider>
          </SWRConfig>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}
