import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import Typography from '@material-ui/core/Typography'
import Tilty from 'react-tilty'
import { Course } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { SectionPlus, useCourseData } from '../../lib/data/useCourseData'
import { onlyOne, getFirestoreDocument, sanitizeHTML } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { defaultComparator, EnhancedTable } from '../../components/datatable'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard'
import { CustomSkeleton } from '../../components/skeleton'
import { buildArgs } from '../../lib/environment'
import styles from './course.module.scss'


export interface CourseProps {
  staticCourseName: string;
  staticDescription: string;
  //staticHTML: string;
  staticLongDescription: string;
}

export default function IndividualCourse({ staticCourseName, staticDescription, staticLongDescription }: CourseProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useCourseData(staticCourseName)
  const isMissingProps = staticCourseName === undefined || false
  const RELATED_INSTRUCTOR_LIMIT = 4;

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
        { !isMissingProps ? 
          <Typography variant="body1" color="text.primary">
            {staticLongDescription}
          </Typography>
          : 
          <Skeleton variant="text" width={'100%'} height={20} />
         }
        <h6>Sources:</h6>
        { status === 'success' ? data.publications.map(e => (
          <Chip key={e.key} label={e.title} className={styles.chip} component="a" href={e.url} clickable />
        )) : [1,2].map(e => <CustomSkeleton key={e} width={230} height={32} />)}
        <h3>Basic Information</h3>
        <ul>
          <li>Earliest record: { status === 'success' ? data.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Latest record: { status === 'success' ? data.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
        </ul>
        <h3>Related Groups</h3>
        { status === 'success' ? data.relatedGroups.map(e => (
          <Chip key={e.key} label={e.title} className={styles.chip} onClick={() => router.push(e.href)} />
        )) : [1].map(e => <CustomSkeleton key={e} width={150} height={32} />)}
        <h3>Related Instructors</h3>
        <Carousel>
          { status === 'success' ? data.relatedInstructors.slice(0,RELATED_INSTRUCTOR_LIMIT).map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>
          ) : Array.from(new Array(RELATED_INSTRUCTOR_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
          { status === 'success' && data.relatedInstructors.length > RELATED_INSTRUCTOR_LIMIT ? <InstructorCardShowMore courseName={staticCourseName} data={data.relatedInstructors} /> : ''}
        </Carousel>
        <h3>Visualization</h3>
        <Box component="div" width={'100%'} height={150} style={{ backgroundColor: 'silver' }} />
        <h3>Data</h3>
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={status === 'success' ? data.dataGrid.columns : []}
          rows={status === 'success' ? data.dataGrid.rows : []}
          defaultOrderBy="term"
        />
        {/* Intentionally empty */}
        <Box component="div" width={'100%'} height={30} />
      </main>
    </Container>
    </>
  )
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  // console.time('getStaticPaths')
  // const data = await getFirestoreCollection<Course>('catalog');
  // console.timeEnd('getStaticPaths')
  return {
    paths: [
      //{ params: { courseName: '' } },
      //...(buildArgs.vercelEnv === 'production' ? data.map(e => ( { params: { courseName: e._id }})) : [])
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CourseProps> = async (context) => {
  //console.time('getStaticProps')
  const { params, locale } = context;
  const { courseName } = params
  const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const description = courseData !== undefined ? courseData.description : ''
  const rawHTML = courseData.publications !== undefined && 
    Array.isArray(courseData.publications) &&
    courseData.publications.length > 0
    ? 
    sanitizeHTML(courseData.publications.sort((a,b) => defaultComparator(a.catoid, b.catoid))[0].content)
    :
    '';
  function getLongDescription(raw: string): string {
    const desc = raw.indexOf('<strong>Description</strong>');
    const br1 = raw.indexOf('<br>', desc) + '<br>'.length
    const br2 = raw.indexOf('<br>', br1);
    return raw.substring(br1, br2).trim();
  }
  const longDescription = getLongDescription(rawHTML);
  //console.timeEnd('getStaticProps')

  return { 
    props: { 
      staticCourseName: onlyOne(courseName),
      staticDescription: description,
      //staticHTML: rawHTML,
      staticLongDescription: longDescription,
    }
  };

}

