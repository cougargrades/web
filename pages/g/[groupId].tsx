import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import { Group } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { onlyOne, getFirestoreCollection } from '../../lib/ssg'
import { buildArgs } from '../../lib/environment'

export interface GroupProps {
  groupId: string;
}

export default function IndividualGroup({ groupId }: GroupProps) {
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

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  // console.time('getStaticPaths')
  // const data = await getFirestoreCollection<Group>('groups');
  // console.timeEnd('getStaticPaths')
  return {
    paths: [
      //{ params: { courseName: '' } },
      //...(buildArgs.vercelEnv === 'production' ? data.map(e => ( { params: { groupId: e.identifier }})) : [])
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<GroupProps> = async (context) => {
  const { params } = context;
  const { groupId } = params
  return { props: { groupId: onlyOne(groupId) }};
}
