import React, { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRecoilState } from 'recoil'
import { Group } from '@cougargrades/types'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../../components/panko'
import { GroupNav, GroupContent } from '../../components/groupnav'
import { selectedGroupResultKey } from '../../lib/recoil'
import { useIsCondensed } from '../../lib/hook'
import { getFirestoreDocument, onlyOne } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'

import styles from '../../styles/Groups.module.scss'

export interface GroupProps {
  staticGroupId: string;
  staticName: string;
  staticDescription: string;
}

export default function Groups({ staticGroupId, staticName, staticDescription }: GroupProps) {
  const stone = useRosetta()
  const [selected, setSelected] = useRecoilState(selectedGroupResultKey)
  const condensed = useIsCondensed()

  useEffect(() => {
    console.log('groupId?',staticGroupId)
    if(staticGroupId) setSelected(staticGroupId);
  }, [staticGroupId])

  return (
    <>
      <Head>
        <title>{staticName || staticGroupId} / CougarGrades.io</title>
        <meta name="description" content={staticDescription || stone.t('meta.groups.description')} />
      </Head>
      <Container>
        <PankoRow />
      </Container>
      <main className={styles.main}>
        <aside className={styles.nav}>
          <GroupNav />
        </aside>
        { condensed ? <></> : 
        <div>
          <GroupContent groupId={selected} />
        </div>
        }
      </main>
      {/* <div className="container-xxl" style={{ width: 'unset' }}>
        <div className="row">
          <nav className="col-12 col-md-3">
            <GroupNav />
          </nav>
          <div className="d-none d-md-block col-md-9">
            <GroupContent />
          </div>
        </div>
      </div> */}
      {/* <Container>
        
        <main>
          <h1>UH Core Curriculum</h1>
          <h6>Source:</h6>
          <Chip label="UH Core Curriculum 2020-2021 " component="a" href="http://publications.uh.edu/content.php?catoid=36&navoid=13119" clickable />
          { status === 'success' ? data.core_curriculum.map(e => (
            <GroupRow key={e.key} data={e} />
          )) : '' }
        </main>
      </Container> */}
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