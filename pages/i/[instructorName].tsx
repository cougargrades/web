import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'

export default function IndividualInstructor() {
  const { instructorName } = useRouter().query;

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