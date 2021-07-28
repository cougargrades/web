import Head from 'next/head'
import Container from '@material-ui/core/Container'
import Chip from '@material-ui/core/Chip'
import { PankoRow } from '../components/panko'
import { useAllGroups } from '../lib/data/useAllGroups'
import { GroupRow } from '../components/grouprow'
import { useRosetta } from '../lib/i18n'

export default function Groups() {
  const stone = useRosetta()
  const { data, status } = useAllGroups();
  return (
    <>
      <Head>
        <title>Groups - CougarGrades.io</title>
        <meta name="description" content={stone.t('meta.groups.description')} />
      </Head>
      <Container>
        <PankoRow />
        <main>
          <h1>UH Core Curriculum</h1>
          <h6>Source:</h6>
          <Chip label="UH Core Curriculum 2020-2021 " component="a" href="http://publications.uh.edu/content.php?catoid=36&navoid=13119" clickable />
          { status === 'success' ? data.core_curriculum.map(e => (
            <GroupRow key={e.key} data={e} />
          )) : '' }
          {/* <h1>All Groups</h1>
          { status === 'success' ? data.all_groups.map(e => (
            <GroupRow key={e.key} data={e} />
          )) : '' } */}
        </main>
      </Container>
    </>
  );
}
