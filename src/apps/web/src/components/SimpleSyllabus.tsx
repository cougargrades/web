import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Slide, Typography, useMediaQuery, useTheme } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionIcon from '@mui/icons-material/Description'
import { Temporal } from 'temporal-polyfill'
import { formatTermCode, parseTermStringAsTermCode } from '@cougargrades/models';
import { getDocumentViewUrl, getSearchResultsUrl, getThumbnailUrl, SSSearchResponse } from '@cougargrades/vendor/simplesyllabus'
//import type { SSSearchResponse } from '@cougargrades/vendor/simplesyllabus';
import type { TransitionProps } from '@mui/material/transitions';
import { useSwipeable } from 'react-swipeable';
import { LiveDataBadge, LiveDataDisclaimer } from './LiveDataDisclaimer'

import interactivity from '../styles/interactivity.module.scss'
import instructorCardStyles from '../components/instructorcard.module.scss'




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
    term_codes = term_names?.map(t => parseTermStringAsTermCode(t)) ?? [];
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

const SYLLABUS_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ hours: 24 });

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
        <LiveDataDisclaimer cacheLifetime={SYLLABUS_CACHE_LIFETIME} />
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
                    <Link to={getDocumentViewUrl(item.code)} target="_blank" className="nostyle">
                      <ListItem className={instructorCardStyles.badgeStackListItem}>
                        <ListItemAvatar>
                          <Avatar alt="Thumbnail" src={getThumbnailUrl(item.code)} style={{ overflow: 'initial' }} imgProps={{ style: { marginBottom: 0 }}} />
                        </ListItemAvatar>
                        <ListItemText primary={`${item.title}${item.subtitle !== '' ? ` - ${item.subtitle}` : ''}`} secondary={item.editors?.[0]?.full_name ?? ''} />
                      </ListItem>
                    </Link>
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

