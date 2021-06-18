import Head from 'next/head'
import Layout from '../components/layout'

export default function Courses() {
  return (
    <>
      <Head>
        <title>Courses - CougarGrades.io</title>
        <meta name="description" content="Courses page" />
      </Head>
      <Layout>
        <div className="new-container">
          <h2>Courses</h2>
        </div>
      </Layout>
    </>
  );
}