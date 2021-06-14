import Head from 'next/head'
import Layout from '../components/layout'

export default function Instructors() {
  return (
    <>
      <Head>
        <title>Instructors - CougarGrades.io</title>
        <meta name="description" content="Instructors page" />
      </Head>
      <Layout>
        <div>Instructors</div>
      </Layout>
    </>
  );
}