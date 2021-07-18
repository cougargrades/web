import React from 'react'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'

export default function IndividualCourse() {
  const { courseName } = useRouter().query;

  return (
    <Container>
      <PankoRow />
      <h1>Hi {courseName}</h1>
    </Container>
  )
}