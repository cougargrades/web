import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import { Course } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { onlyOne, getStaticData } from '../../lib/ssg'

export interface CourseProps {
  courseName: string,
  description: string,
}

export default function IndividualCourse({ courseName, description }: CourseProps) {
  return (
    <>
    <Head>
      <title>{courseName} / CougarGrades.io</title>
      <meta name="description" content={`${courseName} (${description}) is a course at the University of Houston. View grade distribution data at CougarGrades.io.`} />
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
  const { params } = context;
  const { courseName } = params
  const courseData = await getStaticData<Course>(`catalog-getCourseByName?courseName=${courseName}`, undefined)
  const description = courseData !== undefined ? courseData.description : ''

  return { 
    props: { 
      courseName: onlyOne(courseName),
      description,
    }
  };
}
