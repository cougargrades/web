import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'

export default function Groups() {
  return (
    <>
      <Head>
      <title>Groups - CougarGrades.io</title>
        <meta name="description" content="Groups page" />
      </Head>
      <Header />
      <div>Groups</div>
      <Footer />
    </>
  );
}