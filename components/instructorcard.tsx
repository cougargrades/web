import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActionArea from '@material-ui/core/CardActionArea'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import CloseIcon from '@material-ui/icons/Close'
import Skeleton from '@material-ui/core/Skeleton'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import ListSubheader from '@material-ui/core/ListSubheader'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
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
  courseName: string;
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
    children?: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function InstructorCardShowMore({ courseName, data }: InstructorCardShowMoreProps) {
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
            View all {courseName} instructors
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
          All {courseName} instructors <br />
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
                    <ListItem button className={styles.badgeStackListItem} onClick={() => router.push(item.href)} secondaryAction={
                      <Box className={styles.badgeStack}>
                        {item.badges.map(e => (
                          <Badge key={e.key} style={{ backgroundColor: e.color, fontSize: '0.7em' }}>{e.text}</Badge>
                        ))}
                      </Box>
                    }>
                      <ListItemText primary={item.id} secondary={item.caption} />
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
