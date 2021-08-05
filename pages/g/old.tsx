import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import { Group } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { useGroupData } from '../../lib/data/useGroupData'
import { onlyOne, getFirestoreDocument } from '../../lib/ssg'
import { buildArgs } from '../../lib/environment'

import styles from './group.module.scss'
import { EnhancedTable } from '../../components/datatable'

export interface GroupProps {
  staticGroupId: string;
  staticName: string;
  staticDescription: string;
}

export default function IndividualGroup({ staticGroupId, staticName, staticDescription }: GroupProps) {
  const { data, status } = useGroupData(staticGroupId)
  const isMissingProps = staticGroupId === undefined || false
  return (
    <>
    <Head>
      <title>{staticName || staticGroupId} / CougarGrades.io</title>
      <meta name="description" content={`Groups of courses from the University of Houston. View grade distribution data at CougarGrades.io.`} />
    </Head>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.groupHero}>
          <h1>{!isMissingProps ? staticName : <Skeleton variant="text" width={360} height={50} />}</h1>
          <p>{!isMissingProps ? staticDescription : <Skeleton variant="text" width="100%" />}</p>
          { status === 'success' ? data.categories.map(e => (
            e.href ? 
            <Chip key={e.key} label={e.title} className={styles.chip} component="a" href={e.href} clickable />
            :
            <Chip key={e.key} label={e.title} className={styles.chip} />
          )) : [1].map(e => <Skeleton key={e} variant="text" width={230} height={32} />)}
        </div>
        <h1>Courses</h1>
        <EnhancedTable<{ id: number, foo: string, bar: string}>
          columns={status === 'success' ? [] : []}
          rows={status === 'success' ? [] : []}
          defaultOrderBy="foo"
        />
        {/* Intentionally empty */}
        <Box component="div" width={'100%'} height={30} />
      </main>
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
  const groupData = await getFirestoreDocument<Group>(`/groups/${groupId}`)
  const name = groupData !== undefined ? groupData.name : ''
  const description = groupData !== undefined ? groupData.description : ''
  return {
    props: {
      staticGroupId: onlyOne(groupId),
      staticName: name,
      staticDescription: description,
    }
  };
}
