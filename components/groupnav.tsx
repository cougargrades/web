import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useIsCondensed } from '../lib/hook'
import { tocAtom } from '../lib/recoil'

import styles from './groupnav.module.scss'
//import interactivity from '../styles/interactivity.module.scss'

interface GroupNavSubheaderProps {
  children: React.ReactNode;
}

export function GroupNavSubheader({ children }: GroupNavSubheaderProps) {
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

interface TableOfContentsWrapProps {
  condensedTitle: string;
  children: React.ReactNode;
}

export function TableOfContentsWrap({ condensedTitle, children }: TableOfContentsWrapProps) {
  const [expanded, setExpanded] = useRecoilState(tocAtom)
  const condensed = useIsCondensed()
  return (
    condensed ? 
    <Accordion expanded={expanded} onChange={(_,exp) => setExpanded(exp)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ padding: 0, borderBottom: 'none' }}>{condensedTitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
    :
    <>
    {children}
    </>
  )
}
