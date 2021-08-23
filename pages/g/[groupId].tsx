import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRecoilState } from 'recoil'
import { Group } from '@cougargrades/types'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItemButton from '@material-ui/core/ListItemButton'
import ListItemText from '@material-ui/core/ListItemText'
import { PankoRow } from '../../components/panko'
import { GroupContent, GroupNavSubheader, TableOfContentsWrap } from '../../components/groupnav'
import { FakeLink } from '../../components/link'
import { getFirestoreCollection, getFirestoreDocument, onlyOne } from '../../lib/ssg'
import { GroupResult, useAllGroups } from '../../lib/data/useAllGroups'
import { buildArgs } from '../../lib/environment'
import { useRosetta } from '../../lib/i18n'
import { tocAtom } from '../../lib/recoil'

import styles from '../../styles/Groups.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export interface GroupProps {
  staticGroupId: string;
  staticName: string;
  staticDescription: string;
  doesNotExist?: boolean;
}

export default function Groups({ staticGroupId, staticName, staticDescription, doesNotExist }: GroupProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useAllGroups();
  const isMissingProps = staticGroupId === undefined
  const good = !isMissingProps && status === 'success' && doesNotExist === false
  const [_, setTOCExpanded] = useRecoilState(tocAtom)

  const handleClick = (x: GroupResult) => {
    router.push(x.href, undefined, { scroll: false })
    setTOCExpanded(false)
  }

  useEffect(() => {
    if(good && data.categories.length > 0) {
      // preload referenced areas
      for(let key of data.categories) {
        const cat = data.results[key];
        for(let item of cat) {
          router.prefetch(item.href)
        }
      }
    }
  },[good,data])

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
          <TableOfContentsWrap>
          { good ? data.categories.map(cat => (
            <List key={cat} className={styles.sidebarList} subheader={<GroupNavSubheader>{cat}</GroupNavSubheader>}>
              {data.results[cat].map((e, index) => (
                <React.Fragment key={e.key}>
                  <FakeLink href={e.href}>
                    <ListItemButton
                      selected={e.key === staticGroupId}
                      onClick={() => handleClick(e)}
                      classes={{ root: `${styles.accordionRoot} ${interactivity.hoverActive}`, selected: styles.listItemSelected }}
                      dense
                      >
                      <ListItemText
                        primary={e.title}
                        primaryTypographyProps={{
                          color: (theme) => (e.key === staticGroupId) ? theme.palette.text.primary : theme.palette.text.secondary,
                          fontWeight: 'unset'
                        }}
                        />
                    </ListItemButton>
                  </FakeLink>
                </React.Fragment>
              ))}
            </List>
          )) : <></>
          }
          </TableOfContentsWrap>
        </aside>
        <div>
          { good ? <GroupContent groupId={staticGroupId} /> : <></>}
        </div>
      </main>
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
      doesNotExist: groupData === undefined,
    }
  };
}