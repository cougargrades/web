import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'

export default function Courses() {
  return (
    <>
      <Head>
      <title>Courses - CougarGrades.io</title>
        <meta name="description" content="Courses page" />
      </Head>
      <Header />
      <div>Courses</div>
      <Footer />
    </>
  );
}