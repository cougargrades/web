import React from 'react'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'

export default function IndividualGroup() {
  const { groupId } = useRouter().query;

  return (
    <Container>
      <PankoRow />
      <h1>Hi {groupId}</h1>
    </Container>
  )
}