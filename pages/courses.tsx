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
        <div>Courses</div>
      </Layout>
    </>
  );
}