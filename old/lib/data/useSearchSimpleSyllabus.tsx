import React, { useState } from 'react'
import Button from '@mui/material/Button'
import DescriptionIcon from '@mui/icons-material/Description'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import ListSubheader from '@mui/material/ListSubheader'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useSwipeable } from 'react-swipeable'
import { useThrottle } from 'react-use'
import useSWR from 'swr/immutable'
import { Util } from '@cougargrades/types'
import { LiveDataBadge, LiveDataDisclaimer } from '@/components/LiveDataDisclaimer'
import { Observable, ObservableStatus } from './Observable'
import type { SSSearchResponse } from './back/simplesyllabus'
import { getDocumentViewUrl, getSearchResultsUrl, getThumbnailUrl, SYLLABUS_CACHE_LIFETIME } from './simplesyllabus'
import { formatTermCode } from '../util'

import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from '../../components/instructorcard.module.scss'


/**
 * Search the simple syllabus
 * @param query 
 * @returns 
 */
export function useSearchSimpleSyllabus(query: string, strictSearch: boolean = true): Observable<SSSearchResponse> {
  const throttledQuery = useThrottle(query, 1000);
  const qs = new URLSearchParams({
    query: throttledQuery,
    strict: `${strictSearch}`
  });
  const { data, error, isLoading } = useSWR<SSSearchResponse>(`/api/external/simplesyllabus/search?${qs}`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data ) ? 'loading' : 'success'

  return {
    data,
    status,
    error,
  }
}

export interface SimpleSyllabusLauncherProps {
  data: SSSearchResponse;
  courseName: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * 
 * @param term_names 
 * @returns Distinct term names in chronological descending order
 */
function getDistinctTermNamesChronologically(term_names?: string[]): string[] {
  let term_codes: number[] = [];
  try {
    term_codes = term_names?.map(t => Util.termCode(t)) ?? [];
    // If for WHATEVER REASON a termName -> termCode conversion failed...
    if (term_codes.some(tc => isNaN(tc))) {
      throw new Error('TermCodes contained NaN');
    }
    // Otherwise...
    else {
      return Array.from(new Set(term_codes))
        .sort()
        .reverse()
        .map(tc => formatTermCode(tc));
    }
  }
  catch (err) {
    console.warn('[useSearchSimpleSyllabus] TermName -> TermCode conversion failed at some point in the sorting process. err?', err, 'term_names?', term_names, 'term_codes?', term_codes);
    // Fallback to just using the input and sorting some other way
    return Array.from(new Set(term_names ?? []))
      .sort();
  }
}

export function SimpleSyllabusLauncher({ data, courseName }: SimpleSyllabusLauncherProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const handlers = useSwipeable({
    onSwipedDown: () => open ? setOpen(false) : null,
    preventScrollOnSwipe: true,
  })
  
  // Use the snippet below to verify sorting if troubleshooting in the future 
  //const distinct_term_names = getDistinctTermNamesChronologically([...data?.items.map(r => r.term_name) ?? [], 'Fall 2024', 'Spring 2024', 'Spring 2026']);
  const distinct_term_names = getDistinctTermNamesChronologically(data?.items.map(r => r.term_name));

  return (
    <>
    <Button variant="text" size="small" color="info" onClick={() => setOpen(true)} className={interactivity.hoverActive} style={{ marginRight: '0.35rem', marginBottom: '0.35rem' }} startIcon={<DescriptionIcon />}>
      {data?.items.length ?? 0} syllabi found
    </Button>
    <Dialog
      fullScreen={fullScreen}
      fullWidth={!fullScreen}
      maxWidth={'md'}
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={fullScreen ? Transition : undefined}
    >
      <DialogTitle {...handlers} className={instructorCardStyles.dialogTitle}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setOpen(false)}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
          Related Syllabi
          <LiveDataBadge />
        </span>
        <br />
        <Typography variant="body1" color="text.secondary">
          Powered by <a href="https://uh.simplesyllabus.com/" target="_blank" rel="noreferrer">Simple Syllabus</a>, the offical UH platform for course syllabi.
        </Typography>
        <LiveDataDisclaimer cacheLifetime={SYLLABUS_CACHE_LIFETIME}/>
      </DialogTitle>
      <DialogContent className={instructorCardStyles.showMoreContent}>
        <List
          sx={{
            //position: 'relative',
            overflow: 'auto',
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          {distinct_term_names.map((termName, index, array) => (
              <li key={`section-${termName}`}>
              <ul>
                <ListSubheader>{termName}</ListSubheader>
                {/* <Divider /> */}
                {data?.items.filter(r => r.term_name === termName).map(item => (
                  <React.Fragment key={`item-${termName}-${item.code}`}>
                    <ListItem button className={instructorCardStyles.badgeStackListItem} component="a" href={getDocumentViewUrl(item.code)} target="_blank">
                      <ListItemAvatar>
                        <Avatar alt="Thumbnail" src={getThumbnailUrl(item.code)} style={{ overflow: 'initial' }} imgProps={{ style: { marginBottom: 0 }}} />
                      </ListItemAvatar>
                      <ListItemText primary={`${item.title}${item.subtitle !== '' ? ` - ${item.subtitle}` : ''}`} secondary={item.editors?.[0]?.full_name ?? ''} />
                    </ListItem>
                    { index !== (array.length - 1) ? <Divider /> : ''}
                  </React.Fragment>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" href={getSearchResultsUrl(courseName)} target="_blank" rel="noreferrer" endIcon={<ArrowForwardIcon />}>
          More Results
        </Button>
        <span style={{ flex: '1' }}></span>
        <Button variant="contained" color="primary" onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}
