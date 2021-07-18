import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'

export default function IndividualGroup() {
  const { groupId } = useRouter().query;

  return (
    <>
    <Head>
      <title>{groupId} / CougarGrades.io</title>
      <meta name="description" content={`Groups of courses from the University of Houston. View grade distribution data at CougarGrades.io.`} />
    </Head>
    <Container>
      <PankoRow />
      <h1>Hi {groupId}</h1>
    </Container>
    </>
  )
}