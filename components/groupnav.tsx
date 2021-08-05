import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import List from '@material-ui/core/List'
import ListItemButton from '@material-ui/core/ListItemButton'
import ListItemText from '@material-ui/core/ListItemText'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useAllGroups, useOneGroup } from '../lib/data/useAllGroups'
import { selectedGroupResultKey } from '../lib/recoil'
import { GroupRow } from '../components/grouprow'

import styles from './groupnav.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { useIsCondensed } from '../lib/hook'

interface GroupNavSubheaderProps {
  children: React.ReactNode;
}

function GroupNavSubheader({ children }: GroupNavSubheaderProps) {
  const condensed = useIsCondensed()
  const [sticky, setSticky] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /**
   * Detect when a "position:sticky" element is sticky
   * See: https://stackoverflow.com/a/57991537
   */
  useEffect(()=>{
    const listener = () => {
      if(ref.current) {
        if(sticky !== (ref.current.getBoundingClientRect().y === 5)) setSticky(!sticky);
      }
    }
    if(condensed) document.addEventListener('scroll', listener);

    return () => {
      if(condensed) document.removeEventListener('scroll', listener);
    }
  }, [sticky, ref, condensed])

  return (
    <ListSubheader
      component="div"
      sx={{
        color: (theme) => (condensed ? undefined : theme.palette.text.primary),
        backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f6f8fa' : undefined,
        top: '5px',
        boxShadow: (theme) => sticky ? theme.shadows[3] : 'none',
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
      ref={ref}
      className={styles.listSubHeader}
    >
      {children}
    </ListSubheader>
  )
}

export function GroupNav() {
  const { data, status } = useAllGroups();
  const [selected, setSelected] = useRecoilState(selectedGroupResultKey);
  const condensed = useIsCondensed()

  useEffect(() => {
    console.log('selected?', selected);
  }, [selected])

  return (
    <>
    { status === 'success' ? data.categories.map(cat => (
      <List key={cat} className={styles.sidebarList} subheader={<GroupNavSubheader>{cat}</GroupNavSubheader>}>
        {data.results[cat].map((e, index) => (
          condensed ? 
          <Accordion
            key={e.key}
            classes={{ root: styles.accordionRoot, expanded: styles.accordionRootExpanded }}
            defaultExpanded={false}
            elevation={1}
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'light' ? undefined : undefined,
              boxShadow: (theme) => theme.palette.mode === 'light' ? 'none' : undefined,
              border: (theme) => theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : undefined,
            }}
            >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{e.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GroupRow data={e} />
            </AccordionDetails>
          </Accordion>
          :
          <ListItemButton
            key={e.key}
            selected={e.key === selected}
            onClick={() => setSelected(e.key)}
            classes={{ root: `${styles.accordionRoot} ${interactivity.hoverActive}`, selected: styles.listItemSelected }}
            dense
            >
            <ListItemText primary={e.title} primaryTypographyProps={{ color: (theme) => (e.key === selected) ? theme.palette.text.primary : theme.palette.text.secondary, fontWeight: 'unset' }} />
          </ListItemButton>
        ))}
      </List>
    )) : <></>
    }
    </>
  );
}

interface GroupContentProps {
  groupId: string;
}

export function GroupContent({ groupId }: GroupContentProps) {
  const { data, status } = useOneGroup(groupId);

  return (
    status === 'success' ? <GroupRow data={data} /> : <></>
  )
}
