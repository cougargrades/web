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
        <div className="new-container">
          <h2>About</h2>
        </div>
      </Layout>
    </>
  );
}