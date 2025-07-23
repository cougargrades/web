import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import Skeleton from '@mui/material/Skeleton'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import ListSubheader from '@mui/material/ListSubheader'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { ReactFitty } from 'react-fitty'
import { useSwipeable } from 'react-swipeable'
import { Badge } from './badge'
import { CourseInstructorResult } from '../lib/data/useCourseData'

import styles from './instructorcard.module.scss'
import interactivity from '../styles/interactivity.module.scss'

interface InstructorCardProps {
  data: CourseInstructorResult;
  fitSubtitle?: boolean;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
}

interface InstructorCardShowMoreProps {
  cardTitle: string;
  modalTitle?: string;
  data: CourseInstructorResult[];
}

interface InstructorCardEmptyProps {
  text: string;
  onClick?: () => void;
  href?: string;
}

export function InstructorCard({ data, fitSubtitle, variant, elevation }: InstructorCardProps) {
  return (
    <Card sx={{ width: 250, height: 150 }} variant={variant} elevation={elevation} className={`${styles.instructorCard} ${interactivity.hoverActive}`}>
      <Link href={data.href} passHref>
        <CardActionArea className={styles.cardActionArea}>
          <CardContent className={styles.cardContent}>
            <Box className={styles.badgeRow} component={ReactFitty} minSize={8} maxSize={11}>
              {data.badges.map(e => (
                <Badge key={e.key} className={styles.badgeRowBadge} style={{ backgroundColor: e.color }}>{e.text}</Badge>
              ))}
            </Box>
            <Typography variant="h6" component={ReactFitty} maxSize={18}>
              {data.title}
            </Typography>
            {
              fitSubtitle ?
              <Typography gutterBottom component={ReactFitty} maxSize={18} variant="body2" color="text.secondary" noWrap>
                {data.subtitle}
              </Typography>
              :
              <Typography gutterBottom variant="body2" color="text.secondary" noWrap>
                {data.subtitle}
              </Typography>
            }
            <Typography variant="caption" color="text.primary">
              {data.caption}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function InstructorCardShowMore({ cardTitle, modalTitle, data }: InstructorCardShowMoreProps) {
  const router = useRouter()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)
  const handlers = useSwipeable({
    onSwipedDown: () => open ? setOpen(false) : null,
    preventDefaultTouchmoveEvent: true,
  })
  const firstLetters = Array.from(new Set(data.map(e => e.lastInitial))).sort()
  const sortedData = data.slice().sort((a,b) => b.id.localeCompare(a.id))

  return (
    <>
      <Card variant="outlined" sx={{ width: 250, height: 150 }} className={styles.instructorCard}>
        <CardActionArea className={styles.cardActionArea} onClick={() => setOpen(true)}>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.showMore} color="text.secondary">
              {/* View all {courseName} instructors */}
              {cardTitle}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={!fullScreen}
        maxWidth={'md'}
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={fullScreen ? Transition : undefined}
      >
        <DialogTitle {...handlers} className={styles.dialogTitle}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {/* All {courseName} instructors <br /> */}
          {modalTitle ?? cardTitle} <br />
          <Typography variant="body1" color="text.secondary">{data.length.toLocaleString()} total</Typography>
        </DialogTitle>
        <DialogContent className={styles.showMoreContent}>
          <List
            sx={{
              //position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {firstLetters.map((lastInitial, index, array) => (
              <li key={`section-${lastInitial}`}>
              <ul>
                <ListSubheader>{lastInitial}</ListSubheader>
                {/* <Divider /> */}
                {sortedData.filter(e => e.lastInitial === lastInitial).map(item => (
                  <React.Fragment key={`item-${lastInitial}-${item.id}`}>
                    <ListItem button className={styles.badgeStackListItem} component="a" href={item.href} secondaryAction={
                      <Box className={styles.badgeStack}>
                        {item.badges.map(e => (
                          <Badge key={e.key} style={{ backgroundColor: e.color, fontSize: '0.7em' }}>{e.text}</Badge>
                        ))}
                      </Box>
                    }>
                      <ListItemText primary={item.altTitle ?? item.title} secondary={item.caption} />
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
          <Button variant="contained" color="primary" onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function InstructorCardEmpty({ text, onClick, href }: InstructorCardEmptyProps) {
  return (
    <Card variant="outlined" sx={{ width: 250, height: 150 }} className={styles.instructorCard}>
      { href ? 
      <Link href={href} passHref>
        <CardActionArea className={styles.cardActionArea} onClick={onClick}>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.showMore} color="text.secondary">
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      :
      <CardActionArea className={styles.cardActionArea} onClick={onClick}>
        <CardContent className={styles.cardContent}>
          <Typography className={styles.showMore} color="text.secondary">
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
      }
    </Card>
  )
}

export function InstructorCardSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      className={styles.instructorCard}
      style={{ margin: 4, borderRadius: 5 }}
      width={250}
      height={150}
    />
  )
}
