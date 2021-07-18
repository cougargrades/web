import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'

export default function IndividualCourse() {
  const { courseName } = useRouter().query;

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