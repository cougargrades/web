import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { CardActionArea } from '@material-ui/core'
import { Course } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { useCourseData } from '../../lib/data/useCourseData'
import { onlyOne, getFirestoreDocument } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { CustomSkeleton } from '../../components/skeleton'
import styles from './course.module.scss'
import Grid from '@material-ui/core/Grid'
//import { ReactFitty } from 'react-fitty'
//import fitty from 'fitty'
import { Carousel, InstructorCard } from '../../components/instructorcard'

export interface CourseProps {
  staticCourseName: string,
  staticDescription: string,
}

export default function IndividualCourse({ staticCourseName, staticDescription }: CourseProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useCourseData(staticCourseName)
  const isMissingProps = staticCourseName === undefined || false
  //console.log(data)

  if(status === 'success') {
    // preload referenced areas
    for(let item of data.relatedGroups) {
      router.prefetch(item.href)
    }
    for(let item of data.relatedInstructors) {
      router.prefetch(item.href)
    }
  }

  return (
    <>
    <Head>
      <title>{staticCourseName} / CougarGrades.io</title>
      <meta name="description" content={stone.t('meta.course.description', { staticCourseName, staticDescription })} />
    </Head>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          <figure>
            { !isMissingProps ? <h3>{staticDescription}</h3> : <CustomSkeleton width={360} height={45} /> }
            { !isMissingProps ? <h1 className={styles.display_3}>{staticCourseName}</h1> : <CustomSkeleton width={325} height={75} />}
            <div>
              {status === 'success' ? data.badges.map(e => (
                <Tooltip key={e.key} title={e.caption}>
                  <Box component="span">
                    <Badge style={{ backgroundColor: e.color, marginRight: '0.25rem' }}>{e.text}</Badge>
                  </Box>
                </Tooltip>
              )) : [1,2,3].map(e => (
                <BadgeSkeleton key={e} style={{ marginRight: '0.25rem' }}/>
              ))}
            </div>
          </figure>
        </div>
        { !isMissingProps ? <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies orci diam, eget pellentesque nisl tristique ac. Sed sodales rhoncus commodo. Morbi volutpat nisl lorem, finibus ultricies quam ornare vel.</p> : <Skeleton variant="text" width={'100%'} height={20} />}
        <h6>Sources:</h6>
        { status === 'success' ? data.publications.map(e => (
          <Chip key={e.key} label={e.title} className={styles.chip} component="a" href={e.url} clickable />
        )) : ''}
        <h3>Basic Information</h3>
        <ul>
          <li>Earliest record: { status === 'success' ? data.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Latest record: { status === 'success' ? data.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
        </ul>
        <h3>Related Groups</h3>
        { status === 'success' ? data.relatedGroups.map(e => (
          <Chip key={e.key} label={e.title} className={styles.chip} onClick={() => router.push(e.href)} />
        )) : ''}
        <h3>Related Instructors</h3>
        <Carousel>
          { status === 'success' ? data.relatedInstructors.map(e => <InstructorCard key={e.key} data={e} />) : ''}
        </Carousel>
        {/* <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          
        </Grid> */}
      </main>
    </Container>
    </>
  )
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  //const data = await getStaticData<string[]>('catalog-getAllCourseNames')
  return {
    paths: [], // we want to intentionally leave this blank so that pages can be incrementally generated and stored
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CourseProps> = async (context) => {
  console.time('ssg')
  const { params } = context;
  const { courseName } = params
  const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const description = courseData !== undefined ? courseData.description : ''
  console.timeEnd('ssg')

  return { 
    props: { 
      staticCourseName: onlyOne(courseName),
      staticDescription: description,
    }
  };
}
