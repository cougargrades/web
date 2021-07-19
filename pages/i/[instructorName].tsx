import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
import { onlyOne, getStaticData } from '../../lib/ssg'

export default function IndividualInstructor({ instructorName }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
    <Head>
      <title>{instructorName} / CougarGrades.io</title>
      <meta name="description" content={`${instructorName} is an instructor at the University of Houston. View grade distribution data at CougarGrades.io.`} />
    </Head>
    <Container>
      <PankoRow />
      <h1>Hi {instructorName}</h1>
    </Container>
    </>
  )
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  //const data = await getStaticData<string[]>('instructors-getAllInstructorNames')

  return {
    paths: [], // we want to intentionally leave this blank so that pages can be incrementally generated and stored
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<{ instructorName: string }> = async (context) => {
  const { params } = context;
  const { instructorName } = params
  return { props: { instructorName: onlyOne(instructorName) }};
}
