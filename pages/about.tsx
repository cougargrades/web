import Head from 'next/head'
import Layout from '../components/layout'

export default function About() {
  return (
    <>
      <Head>
        <title>About - CougarGrades.io</title>
        <meta name="description" content="About page" />
      </Head>
      <Layout>
        <div>About</div>
      </Layout>
    </>
  );
}