import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FakeLink } from './link'
import { GroupNavSubheader, TableOfContentsWrap } from './groupnav'
import { tocAtom } from '../lib/recoil'
import { useNotableScrollPosition } from '../lib/scroll'
import { useIsCondensed } from '../lib/hook'

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
  showOverflowScrollers?: boolean;
  children: React.ReactNode;
}

export function SidebarContainer({ condensedTitle, sidebarItems, resetScrollAfterLink, showOverflowScrollers, children }: SidebarContainerProps) {
  const router = useRouter()
  const condensed = useIsCondensed()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)
  const scrollRef = React.useRef<HTMLElement>(null);
  const { atTop, atBottom, topIsVisible, bottomIsVisible, isSticky } = useNotableScrollPosition(scrollRef as any, 30, 32)

  /**
   * Show the Top Hint if:
   * - the top of the sidebar is impossible to scroll to (top isn't visible)
   * - AND the bottom of the sidebar is visible (this ensures that if the sidebar is entirely hidden, the buttons don't show)
   */
  const SHOW_TOP_HINT = !topIsVisible && bottomIsVisible
  /**
   * Show the Bottom Hint if:
   * - the bottom of the sidebar is impossible to scroll to (bottom isn't visible)
   * - AND the top of the sidebar is visible (this ensures that if the sidebar is entirely hidden, the buttons don't show)
   */
  const SHOW_BOTTOM_HINT = !bottomIsVisible && topIsVisible
  
  // useEffect(() => {
  //   console.log('at top?', atTop, 'at bottom?', atBottom, 'top viz?', topIsVisible, 'bottom viz?', bottomIsVisible, 'sticky?', isSticky);
  // }, [atTop, atBottom, topIsVisible, bottomIsVisible, isSticky])

  // useEffect(() => {
  //   console.log('SHOW TOP HINT?', SHOW_TOP_HINT, 'SHOW BOTTOM HINT?', SHOW_BOTTOM_HINT)
  // }, [SHOW_TOP_HINT, SHOW_BOTTOM_HINT])

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href, undefined, { scroll: resetScrollAfterLink === true ? true : false })
      setTOCExpanded(false)
    }
  }

  const handleScroll = (position: 'top' | 'bottom') => {
    const ref = scrollRef.current
    if (ref !== null) {
      if (position === 'top') {
        const deltaY = ref.getBoundingClientRect().top
        window.scrollBy({ top: deltaY, left: 0, behavior: 'smooth' })
        ref.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
      }
      else {
        const absY = ref.getBoundingClientRect().bottom
        window.scrollTo({ top: absY, left: 0, behavior: 'smooth' })
        ref.scrollTo({ top: ref.scrollHeight, left: 0, behavior: 'smooth'})
      }
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
        <aside className={styles.nav} ref={scrollRef}>
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
          { 
            showOverflowScrollers && !condensed
            ? (
              <>
              <div className={styles.listTopHint} style={{ opacity: SHOW_TOP_HINT ? 1.0 : 0.0 }}>
                <span className={`${styles.listHintBubble} ${interactivity.hoverActive}`} onClick={() => handleScroll('top')}><ExpandLessIcon /></span>
              </div>
              <div className={styles.listBottomHint} style={{
                  opacity: SHOW_BOTTOM_HINT ? 1.0 : 0.0,
                }}>
                <span className={`${styles.listHintBubble} ${interactivity.hoverActive}`} onClick={() => handleScroll('bottom')}><ExpandMoreIcon /></span>
              </div>
              </>
            )
            : null
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
