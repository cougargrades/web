import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import { Instructor } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { PankoRow } from '../../components/panko'
import { onlyOne, getFirestoreDocument, getFirestoreCollection } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'
import { buildArgs } from '../../lib/environment'

import styles from './instructor.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

import { CustomSkeleton } from '../../components/skeleton'
import Typography from '@material-ui/core/Typography'
import { tocAtom } from '../../lib/recoil'
import { useInstructorData } from '../../lib/data/useInstructorData'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { EnrollmentInfo } from '../../components/enrollment'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard'
import Tilty from 'react-tilty'
import { EnhancedTable } from '../../components/datatable'
import { SectionPlus } from '../../lib/data/useCourseData'
import { CoursePlus } from '../../lib/data/useGroupData'
import { Chart } from 'react-google-charts'

export interface InstructorProps {
  staticInstructorName: string;
  staticDepartmentText: string;
  doesNotExist?: boolean;
}

export default function IndividualInstructor({ staticInstructorName, staticDepartmentText }: InstructorProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useInstructorData(staticInstructorName)
  const isMissingProps = staticInstructorName === undefined
  const RELATED_COURSE_LIMIT = 4;

  return (
    <>
    <Head>
      <title>{staticInstructorName} / CougarGrades.io</title>
      <meta name="description" content={stone.t('meta.instructor.description', { staticInstructorName, staticDepartmentText })} />
    </Head>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.instructorHero}>
          <figure>
            { !isMissingProps ? <Typography variant="h1">{staticInstructorName}</Typography> : <CustomSkeleton width={325} height={75} />}
            { !isMissingProps ? <Typography variant="h4">{staticDepartmentText}</Typography> : <CustomSkeleton width={360} height={45} /> }
          </figure>
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
        </div>
        {/* Start potential RMP stuff here */}
        {/* End potential RMP stuff here */}
        { status === 'success' ? <>
          <EnrollmentInfo className={styles.enrollmentBar} data={data.enrollment} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <h3>Basic Information</h3>
        <ul>
          <li>Earliest record: { status === 'success' ? data.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Latest record: { status === 'success' ? data.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of courses: { status === 'success' ? data.courseCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of sections: { status === 'success' ? data.sectionCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <Tooltip placement="bottom-start" title="Estimated average size of each section, # of total enrolled ÷ # of sections">
            <li>Average number of students per section: { status === 'success' ? `~ ${data.classSize.toFixed(1)}` : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          </Tooltip>
        </ul>
        <h3>Related Groups</h3>
        { status === 'success' ? data.relatedGroups.map(e => (
          <Tooltip key={e.key} title={e.description}>
            <Chip label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.href} clickable />
          </Tooltip>
        )) : [1].map(e => <CustomSkeleton key={e} width={150} height={32} />)}
        <h3>Related Courses</h3>
        <Carousel>
          { status === 'success' ? data.relatedCourses.slice(0,RELATED_COURSE_LIMIT).map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>
          ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
        </Carousel>
        <h3>Data</h3>
        <div className={styles.chartWrap}>
          {
            status === 'success' ?
            <Chart
              width={'100%'}
              height={350}
              chartType="LineChart"
              loader={<CustomSkeleton width={'100%'} height={350} />}
              data={data.dataChart.data}
              options={data.dataChart.options}
              // prevent ugly red box when there's no data yet on first-mount
              chartEvents={[{ eventName: 'error', callback: (event) => event.google.visualization.errors.removeError(event.eventArgs[0].id) }]}
            />
            :
            <CustomSkeleton width={'100%'} height={150} />
          }
        </div>
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={status === 'success' ? data.sectionDataGrid.columns : []}
          rows={status === 'success' ? data.sectionDataGrid.rows : []}
          defaultOrderBy="term"
        />
        <EnhancedTable<CoursePlus>
          title="Courses"
          columns={status === 'success' ? data.courseDataGrid.columns : []}
          rows={status === 'success' ? data.courseDataGrid.rows : []}
          defaultOrderBy="id"
        />
      </main>
    </Container>
    </>
  )
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  // console.time('getStaticPaths')
  // const data = await getFirestoreCollection<Instructor>('instructors');
  // console.timeEnd('getStaticPaths')
  return {
    paths: [
      //{ params: { courseName: '' } },
      //...(buildArgs.vercelEnv === 'production' ? data.map(e => ( { params: { instructorName: e._id }})) : [])
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<InstructorProps> = async (context) => {
  //console.time('getStaticProps')
  const { params } = context;
  const { instructorName } = params
  const instructorData = await getFirestoreDocument<Instructor>(`/instructors/${instructorName}`)
  const departmentText = getDepartmentText(instructorData)
  //console.timeEnd('getStaticProps')

  return {
    props: {
      staticInstructorName: onlyOne(instructorName),
      staticDepartmentText: departmentText,
      doesNotExist: instructorData === undefined,
    }
  };
}

function getDepartmentText(data: Instructor | undefined) {
  // sort department entries in descending by value
  if(data !== undefined) {
    const text = Object
      .entries(data.departments) // [string, number][]
      .sort((a, b) => b[1] - a[1]) // sort
      .slice(0, 3) // limit to 3 entries
      .map(e => abbreviationMap[e[0]]) // ['MATH'] => ['Mathematics']
      .filter(e => e !== undefined) // remove those that didn't have an abbreviation
      .join(', '); // 'Mathematics, Computer Science'
    return text;
  }
  return ''
}
