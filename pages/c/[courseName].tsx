import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
import { useNextQueryParams } from '../../lib/query'

export default function IndividualCourse() {
  // router.query is inaccessible on the first render, bad for SEO
  // See: https://github.com/vercel/next.js/discussions/11484#discussioncomment-60563
  const { courseName } = useNextQueryParams()

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