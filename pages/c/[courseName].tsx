import React from 'react'
import Head from 'next/head'
//import { useRouter } from 'next/router'
import { GetServerSideProps, GetStaticPaths, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from 'next'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
//import { useSlug } from '../../lib/query'

//export default function IndividualCourse({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function IndividualCourse({ courseName }: InferGetStaticPropsType<typeof getStaticProps>) {
  //const courseName = params?.courseName

  console.log(courseName)

  //const { courseName } = useRouter().query
  //const { slug, courseName } = useSlug('courseName')
  //console.log('router', courseName)
  //console.log('slug', slug)
  // console.log(router)
  // console.log


  return (
    <>
    <Head>
      <title>{courseName} / CougarGrades.io</title>
      <meta name="description" content={`${courseName} is a course at the University of Houston. View grade distribution data at CougarGrades.io.`} />
    </Head>
    <Container>
      <PankoRow />
      <h1>Hi {courseName}</h1>
    </Container>
    </>
  )
}

//export const getServerSideProps: GetServerSideProps = async ({ params }) => ({ props: { params: params } });

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [
//       { params: { courseName: '1' } },
//       { params: { courseName: '2' } },
//     ],
//     fallback: true
//   }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // we want to intentionally leave this blank so that pages can be incrementally generated and stored
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const { courseName } = params
  return { props: { courseName }};
}
