import React from 'react'
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { CardActionArea } from '@material-ui/core'
import { ReactFitty } from '../vendor/ReactFitty'
import { Badge } from './badge'
import { CourseInstructorResult } from '../lib/data/useCourseData'
import styles from './instructorcard.module.scss'

interface InstructorCardProps {
  data: CourseInstructorResult;
}

export function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.carousel}>
      {children}
    </div>
  )
}

export function InstructorCard({ data }: InstructorCardProps) {
  const router = useRouter()
  return (
    <Card sx={{ width: 250, height: 150 }} className={styles.instructorCard}>
      <CardActionArea className={styles.cardActionArea} onClick={() => router.push(data.href)}>
        <CardContent className={styles.cardContent}>
          <Box className={styles.badgeRow}>
            {data.badges.map(e => (
              <Badge key={e.key} style={{ backgroundColor: e.color, fontSize: '0.7em', marginRight: '0.25rem' }}>{e.text}</Badge>
            ))}
          </Box>
          <Typography variant="h6" component={ReactFitty} maxSize={18}>
            {data.title}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.disabled" noWrap>
            {data.subtitle}
          </Typography>
          <Typography variant="caption" color="text.primary">
            {data.caption}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
