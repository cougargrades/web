import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'

export default function About() {
  return (
    <>
      <Head>
      <title>About - CougarGrades.io</title>
        <meta name="description" content="About page" />
      </Head>
      <Header />
      <div>About</div>
      <Footer />
    </>
  );
}