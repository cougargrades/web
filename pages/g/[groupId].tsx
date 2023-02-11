import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import useSWR from 'swr/immutable'
import { Group } from '@cougargrades/types'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { PankoRow } from '../../components/panko'
import { getFirestoreCollection, getFirestoreDocument } from '../../lib/data/back/getFirestoreData'
import { GroupContent, GroupContentSkeleton } from '../../components/groupcontent'
import { AllGroupsResult, PopulatedGroupResult } from '../../lib/data/useAllGroups'
import { useRosetta } from '../../lib/i18n'
import { ObservableStatus } from '../../lib/data/Observable'
import { extract } from '../../lib/util'
import { SidebarContainer, SidebarItem } from '../../components/sidebarcontainer'

import styles from './group.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import { AllSubjectsList } from '../../components/AllSubjectsList'

export interface GroupProps {
  staticGroupId: string;
  staticName: string;
  staticDescription: string;
  doesNotExist?: boolean;
  isFakeGroup: boolean;
}

export default function Groups({ staticGroupId, staticName, staticDescription, doesNotExist, isFakeGroup }: GroupProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, error: error2, isLoading: isLoading2 } = useSWR<AllGroupsResult>(`/api/group`)
  const status: ObservableStatus = error2 ? 'error' : (isLoading2 || !data || !staticGroupId) ? 'loading' : 'success'
  const allGroupsData = status === 'success' && data !== undefined ? data.core_curriculum : []
  const sidebarItems: SidebarItem[] = [
    ...(allGroupsData.map(group => ({
      key: group.key,
      categoryName: group.categories.filter(e => !e.startsWith('#')).at(0) ?? '',
      title: group.title,
      href: group.href,
    }))),
    {
      key: 'all-subjects',
      categoryName: 'Other Groups',
      title: 'All Subjects',
      href: '/g/all-subjects',
    },
  ]

  const { data: oneGroupData, error, isLoading } = useSWR<PopulatedGroupResult>(`/api/group/${isFakeGroup ? `${undefined}` : staticGroupId}`)
  const oneGroupStatus: ObservableStatus = error ? 'error' : (isLoading || !oneGroupData || !staticGroupId) ? 'loading' : 'success'
  
  const isMissingProps = staticGroupId === undefined
  const good = !isMissingProps && oneGroupStatus === 'success'

  useEffect(() => {
    // preload referenced areas
    for(let item of allGroupsData) {
      router.prefetch(item.href)
    }
  },[allGroupsData])

  return (
    <>
      <Head>
        <title>{(staticName || staticGroupId) !== undefined ? `${staticName || staticGroupId} / ` : ''}CougarGrades.io</title>
        <meta name="description" content={staticDescription || stone.t('meta.groups.description')} />
      </Head>
      <Container>
        <PankoRow />
      </Container>
      <SidebarContainer condensedTitle="Select Group" sidebarItems={sidebarItems}>
        { doesNotExist === true ? 
          <Alert severity="error">
            <AlertTitle>Error 404</AlertTitle>
            Group {staticGroupId} could not be found.
          </Alert>
        : <></>
        }
        { }
        {
          isFakeGroup && !doesNotExist
          ? <AllSubjectsList />
          : (
            good && doesNotExist === false && oneGroupData !== undefined 
            ? <GroupContent data={oneGroupData} /> 
            : <GroupContentSkeleton />
          )
        }
      </SidebarContainer>
    </>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  // console.time('getStaticPaths')
  // const data = await getFirestoreCollection<Group>('groups');
  // console.timeEnd('getStaticPaths')
  return {
    paths: [
      //{ params: { groupId: '' } },
      //...(['production','preview'].includes(buildArgs.vercelEnv) ? data.map(e => ( { params: { groupId: e.identifier }})) : [])
    ],
    fallback: true
  }
}

const FAKE_GROUPS: Group[] = [
  {
    name: 'All Subjects',
    identifier: 'all-subjects',
    description: '',
    courses: [],
    sections: [],
    keywords: [],
    categories: [],
    sources: [],
  }
]

export const getStaticProps: GetStaticProps<GroupProps> = async (context) => {
  const { params } = context;
  const groupId = params?.groupId;
  const isFakeGroup = FAKE_GROUPS.map(e => e.identifier).includes(extract(groupId))
  const groupData = isFakeGroup ? FAKE_GROUPS.find(e => e.identifier === groupId)! : await getFirestoreDocument<Group>(`/groups/${groupId}`)
  const name = groupData !== undefined ? groupData.name : ''
  const description = groupData !== undefined ? groupData.description : ''
  return {
    props: {
      staticGroupId: extract(groupId),
      staticName: name,
      staticDescription: description,
      doesNotExist: groupData === undefined,
      isFakeGroup,
    }
  };
}