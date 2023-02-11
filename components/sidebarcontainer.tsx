import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { FakeLink } from './link'
import { GroupNavSubheader, TableOfContentsWrap } from './groupnav'
import { tocAtom } from '../lib/recoil'

import styles from './sidebarcontainer.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export interface SidebarItem {
  key: React.Key | null | undefined;
  categoryName: string;
  title: React.ReactNode;
  href?: string;
  disabled?: boolean;
}

export interface SidebarContainerProps {
  condensedTitle: string;
  sidebarItems: SidebarItem[];
  //selectedSidebarItem?: React.Key;
  resetScrollAfterLink?: boolean;
  children: React.ReactNode;
}

export function SidebarContainer({ condensedTitle, sidebarItems, resetScrollAfterLink, children }: SidebarContainerProps) {
  const router = useRouter()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href, undefined, { scroll: resetScrollAfterLink === true ? true : false })
      setTOCExpanded(false)
    }
  }

  useEffect(() => {
    for(let item of sidebarItems) {
      if (item.href) {
        router.prefetch(item.href)
      }
    }
  },[sidebarItems])

  return (
    <>
      <main className={styles.main}>
        <aside className={styles.nav}>
          <TableOfContentsWrap condensedTitle={condensedTitle}>
          { Array.from(new Set(sidebarItems.map(e => e.categoryName))).map(cat => (
            <List key={cat} className={styles.sidebarList} subheader={<GroupNavSubheader>{cat}</GroupNavSubheader>}>
              {sidebarItems.filter(e => e.categoryName === cat).map((e, index) => (
                <React.Fragment key={e.key}>
                  <FakeLink href={e.href ?? "#"} style={{ cursor: e.disabled ? 'not-allowed' : 'auto' }}>
                    <ListItemButton
                      selected={e.href === router.asPath}
                      onClick={() => handleClick(e.href)}
                      classes={{ root: `${styles.accordionRoot} ${interactivity.hoverActive}`, selected: styles.listItemSelected }}
                      disabled={e.disabled}
                      data-disabled={e.disabled}
                      dense
                      >
                      <ListItemText
                        primary={e.title}
                        primaryTypographyProps={{
                          color: (theme) => (e.href === router.asPath) ? theme.palette.text.primary : theme.palette.text.secondary,
                          fontWeight: 'unset'
                        }}
                        />
                    </ListItemButton>
                  </FakeLink>
                </React.Fragment>
              ))}
            </List>
          ))
          }
          </TableOfContentsWrap>
        </aside>
        <article>
          {children}
        </article>
      </main>
    </>
  );
}
