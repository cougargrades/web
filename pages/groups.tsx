import Head from 'next/head'
import Layout from '../components/layout'

export default function Groups() {
  return (
    <>
      <Head>
        <title>Groups - CougarGrades.io</title>
        <meta name="description" content="Groups page" />
      </Head>
      <Layout>
        <div className="new-container">
          <h2>Groups</h2>
        </div>
      </Layout>
    </>
  );
}