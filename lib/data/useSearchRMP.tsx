import React, { useState } from 'react'
import Button from '@mui/material/Button'
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
import Divider from '@mui/material/Divider'
import ListSubheader from '@mui/material/ListSubheader'
import Rating from '@mui/material/Rating'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useSwipeable } from 'react-swipeable'
import { useThrottle } from 'react-use'
import useSWR from 'swr/immutable'
import { LiveDataBadge, LiveDataDisclaimer } from '@/components/LiveDataDisclaimer'
import { Observable, ObservableStatus } from './Observable'
import type { RMPRankedSearchResult } from './back/rmp'
import { getRMPProfessorSearchUrl, getRMPProfessorViewableUrl, getRMPSchoolViewableUrl, RMP_CACHE_LIFETIME, UH_RMP_SCHOOL_IDS } from './rmp'

import interactivity from '../../styles/interactivity.module.scss'
import instructorCardStyles from '../../components/instructorcard.module.scss'
import linkStyles from '../../components/link.module.scss'
import styles from './useSearchRMP.module.scss'


/**
 * Search the simple syllabus
 * @param query 
 * @returns 
 */
export function useSearchRMP(firstName: string, lastName: string, strictSearch: boolean = true): Observable<RMPRankedSearchResult[]> {
  const query = `${firstName} ${lastName}`;
  const throttledQuery = useThrottle(query, 1000);
  const qs = new URLSearchParams({
    query: throttledQuery,
    strict: `${strictSearch}`
  });
  const { data, error, isLoading } = useSWR<RMPRankedSearchResult[]>(`/api/external/rmp/search?${qs}`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data ) ? 'loading' : 'success'

  return {
    data,
    status,
    error,
  }
}

export interface RMPLauncherProps {
  instructorFirstName: string;
  instructorLastName: string;
  data: RMPRankedSearchResult[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export function RMPLauncher({ instructorFirstName, instructorLastName, data }: RMPLauncherProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const handlers = useSwipeable({
    onSwipedDown: () => open ? setOpen(false) : null,
    preventScrollOnSwipe: true,
  })

  let rmpDistinctSchools = Array.from(new Set(data.map(d => d.school.id)))
    // Take the unique school IDs and get the names
    .map(rmpSchoolId => data.find(d => d.school.id === rmpSchoolId)?.school)
    .filter(rmpSchool => rmpSchool !== undefined)
    .sort((a,b) => a.name.localeCompare(b.name));

  // Some artificial sorting
  rmpDistinctSchools = [
    // UH Campuses first
    ...rmpDistinctSchools.filter(s => UH_RMP_SCHOOL_IDS.includes(s.id)),
    // All other schools
    ...rmpDistinctSchools.filter(s => !UH_RMP_SCHOOL_IDS.includes(s.id)),
  ]

  function renderListItem(item: RMPRankedSearchResult, index: number, array: RMPRankedSearchResult[]) {
    return (
      <React.Fragment key={item.id}>
        <ListItem button className={instructorCardStyles.badgeStackListItem} component="a" href={getRMPProfessorViewableUrl(item.legacyId.toString())} target="_blank" rel="noreferrer" secondaryAction={
            <Tooltip title={`${item.avgRatingRounded.toFixed(1)} in Overall Quality Based on ${item.numRatings} rating(s)`} placement="top-start" arrow>
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Rating value={item.avgRatingRounded} precision={0.1} readOnly />
                <Typography color="inherit" variant="caption" sx={{ paddingTop: '0' }}>
                  {item.numRatings} rating(s)
                </Typography>
              </span>
            </Tooltip>
          }>
            {/* secondary={`${item.department} • ${item.school.name}`} */}
          <ListItemText
            primary={
              <>
              <span style={{ display: 'inline-flex', gap: '20px' }}>
                <span>
                  {`${item.firstName} ${item.lastName}` }
                </span>
                {/*<Chip color="info" label={`Likely Match`} title={`Dice-Sørensen coefficient: ${item._searchScore.toFixed(3)}`}  size="small" />*/}
                {
                  item._searchScore >= 0.85
                  ? null
                  : null
                }
              </span>
              </>
            }
            secondary={`${item.department}`}
            />
        </ListItem>
        { index !== (array.length - 1) ? <Divider /> : ''}
      </React.Fragment>
    )
  }

  return (
    <>
    <Button 
      variant="text"
      size="small"
      color="info"
      className={interactivity.hoverActive}
      startIcon={<RateReviewIcon />}
      onClick={() => setOpen(true)}
      style={{ marginRight: '0.35rem', marginBottom: '0.35rem' }}
      >
      {data?.length ?? 0} {(data?.length ?? 0) === 1 ? 'result' : 'results'} on RateMyProfessors.com
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
          RateMyProfessors.com Results
          <LiveDataBadge />
        </span>
        <br />
        <Typography variant="body1" color="text.secondary">
          Search results for: <code>{instructorFirstName} {instructorLastName}</code>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          &copy; 2025 Rate My Professors, LLC. All Rights Reserved.
        </Typography>
        <LiveDataDisclaimer cacheLifetime={RMP_CACHE_LIFETIME} />
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
          {rmpDistinctSchools.map(rmpSchool => (
            <li key={rmpSchool.id}>
              <ul>
                <ListSubheader className={styles.listSubHeader}>
                  <span className={styles.listSubHeaderFlex}>
                    {
                      UH_RMP_SCHOOL_IDS.includes(rmpSchool.id)
                      ? <>
                      <img
                        src={"/img/uh_red.png"}
                        alt="University of Houston symbol"
                        style={{ width: '1.5em', height: '1.5em', paddingRight: 'calc(1.5em / 2 - 10px)', margin: '0' }}
                      />
                      </>
                      : null
                    }
                    <a className={`${linkStyles.linkMinimumStyle} ${styles.listSubHeader_School}`}
                    href={getRMPSchoolViewableUrl(rmpSchool.legacyId.toString())} target="_blank" rel="noreferrer"
                    >
                      {rmpSchool.name}
                    </a>
                    <Typography variant="inherit" color="text.disabled" className={styles.listSubHeader_Hyphen}>
                      &mdash;
                    </Typography>
                    <Typography variant="inherit" color="text.disabled" className={styles.listSubHeader_Location}>
                      {rmpSchool.city}, {rmpSchool.state}
                    </Typography>
                  </span>
                </ListSubheader>
                {data.filter(item => item.school.id === rmpSchool.id).map((item, index, array) => renderListItem(item, index, array))}
              </ul>
            </li>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" href={getRMPProfessorSearchUrl(`${instructorFirstName} ${instructorLastName}`)} target="_blank" rel="noreferrer" endIcon={<ArrowForwardIcon />}>
          More Results
        </Button>
        <span style={{ flex: '1' }}></span>
        <Button variant="contained" color="primary" onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}
