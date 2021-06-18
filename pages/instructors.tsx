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
        <div className="new-container">
          <h2>Instructors</h2>
        </div>
      </Layout>
    </>
  );
}