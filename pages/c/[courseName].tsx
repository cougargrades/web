import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
import { useSlug } from '../../lib/query'

export default function IndividualCourse() {
  
  //const { courseName } = useRouter().query
  const { slug, courseName } = useSlug('courseName')
  console.log('router', courseName)
  console.log('slug', slug)
  // console.log(router)
  // console.log


  return (
    <>
    <Head>
      <title>{slug} / CougarGrades.io</title>
      <meta name="description" content={`${slug} is a course at the University of Houston. View grade distribution data at CougarGrades.io.`} />
    </Head>
    <Container>
      <PankoRow />
      <h1>Hi {courseName}</h1>
    </Container>
    </>
  )
}