import React from 'react'
import Head from 'next/head'
import { useRecoilState } from 'recoil'
import { useWindowSize } from 'react-use'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../components/panko'
import { GroupNav, GroupContent } from '../components/groupnav'
import { selectedGroupResultKey } from '../lib/recoil'
import { useRosetta } from '../lib/i18n'

import styles from '../styles/Groups.module.scss'

export default function Groups() {
  const stone = useRosetta()
  const [selected, _] = useRecoilState(selectedGroupResultKey);
  const { width } = useWindowSize()
  const condensed = width < 768;

  return (
    <>
      <Head>
        <title>Groups - CougarGrades.io</title>
        <meta name="description" content={stone.t('meta.groups.description')} />
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
