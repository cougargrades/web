import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import { Instructor } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/com.collegescheduler.uh.subjects/dictionary.json'
import { PankoRow } from '../../components/panko'
import { onlyOne, getFirestoreDocument } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'

export interface InstructorProps {
  instructorName: string,
  departmentText: string,
}

export default function IndividualInstructor({ instructorName, departmentText }: InstructorProps) {
  const stone = useRosetta()
  return (
    <>
    <Head>
      <title>{instructorName} / CougarGrades.io</title>
      <meta name="description" content={stone.t('meta.instructor.description', { instructorName, departmentText })} />
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

export const getStaticProps: GetStaticProps<InstructorProps> = async (context) => {
  console.time('ssg')
  const { params } = context;
  const { instructorName } = params
  const instructorData = await getFirestoreDocument<Instructor>(`/instructors/${instructorName}`)
  const departmentText = getDepartmentText(instructorData)
  console.timeEnd('ssg')

  return {
    props: {
      instructorName: onlyOne(instructorName),
      departmentText: departmentText,
    }
  };
}

function getDepartmentText(data: Instructor | undefined) {
  // sort department entries in descending by value
  const entries = Object.entries(data.departments).sort((a, b) => b[1] - a[1])
  if(entries.length > 0) {
    const departmentName: string | undefined = abbreviationMap[entries[0][0]];
    if(departmentName !== undefined) {
      return departmentName
    }
  }
  return ''
}
