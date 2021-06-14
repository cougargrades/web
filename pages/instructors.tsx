import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'

export default function Instructors() {
  return (
    <>
      <Head>
      <title>Instructors - CougarGrades.io</title>
        <meta name="description" content="Instructors page" />
      </Head>
      <Header />
      <div>Instructors</div>
      <Footer />
    </>
  );
}