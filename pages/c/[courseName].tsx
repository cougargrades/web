import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
import { onlyOne, getPathsData } from '../../lib/ssg'

export default function IndividualCourse({ courseName }: InferGetStaticPropsType<typeof getStaticProps>) {
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

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  //const data = await getPathsData('catalog-getAllCourseNames')
  
  return {
    paths: [], // we want to intentionally leave this blank so that pages can be incrementally generated and stored
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<{ courseName: string }> = async (context) => {
  const { params } = context;
  const { courseName } = params
  return { props: { courseName: onlyOne(courseName) }};
}
