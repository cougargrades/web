import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import { Course } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { onlyOne, getFirestoreDocument } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'

export interface CourseProps {
  courseName: string,
  description: string,
}

export default function IndividualCourse({ courseName, description }: CourseProps) {
  const stone = useRosetta()
  return (
    <>
    <Head>
      <title>{courseName} / CougarGrades.io</title>
      <meta name="description" content={stone.t('meta.course.description', { courseName, description })} />
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
  //const data = await getStaticData<string[]>('catalog-getAllCourseNames')
  
  return {
    paths: [], // we want to intentionally leave this blank so that pages can be incrementally generated and stored
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CourseProps> = async (context) => {
  console.time('ssg')
  const { params } = context;
  const { courseName } = params
  const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const description = courseData !== undefined ? courseData.description : ''
  console.timeEnd('ssg')

  return { 
    props: { 
      courseName: onlyOne(courseName),
      description,
    }
  };
}
