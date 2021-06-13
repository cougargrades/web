import Head from 'next/head';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Core */}
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Iconography */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
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
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
