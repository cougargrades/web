import Head from 'next/head'
import Container from '@material-ui/core/Container'
import { PankoRow } from '../components/panko'
import { useAllGroups } from '../lib/data/useAllGroups'
import { GroupRow } from '../components/grouprow'

export default function Groups() {
  const { data, status } = useAllGroups();
  return (
    <>
      <Head>
        <title>Groups - CougarGrades.io</title>
        <meta name="description" content="Groups page" />
      </Head>
      <Container>
        <PankoRow />
        <main>
          <h1>UH Core Curriculum</h1>
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
