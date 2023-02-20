import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import useSWR from 'swr/immutable'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import RateReviewIcon from '@mui/icons-material/RateReview'
import Tilty from 'react-tilty'
import { Chart } from 'react-google-charts'
import { Instructor } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { PankoRow } from '../../components/panko'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { EnrollmentInfo } from '../../components/enrollment'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardSkeleton } from '../../components/instructorcard'
import { EnhancedTable } from '../../components/datatable'
import { CustomSkeleton } from '../../components/skeleton'
import { getFirestoreCollection, getFirestoreDocument } from '../../lib/data/back/getFirestoreData'
import { useRosetta } from '../../lib/i18n'
import { InstructorResult, useInstructorData } from '../../lib/data/useInstructorData'
import { SectionPlus } from '../../lib/data/useCourseData'
import { CoursePlus } from '../../lib/data/useGroupData'
import { LoadingBoxIndeterminate } from '../../components/loading'
import { extract } from '../../lib/util'
import { buildArgs } from '../../lib/environment'
import { metaInstructorDescription } from '../../lib/seo'

import styles from './instructor.module.scss'
import interactivity from '../../styles/interactivity.module.scss'


export interface InstructorProps {
  staticInstructorName: string;
  staticDepartmentText: string;
  staticShortDepartmentText?: string;
  staticFullInstructorName?: string;
  staticMetaDescription: string;
  doesNotExist?: boolean;
}

export default function IndividualInstructor({ staticInstructorName, staticDepartmentText, staticMetaDescription }: InstructorProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useInstructorData(staticInstructorName)
  const isMissingProps = staticInstructorName === undefined
  const RELATED_COURSE_LIMIT = 4;

  if(status === 'success') {
    // preload referenced areas
    for(let item of data!.relatedGroups) {
      router.prefetch(item.href)
    }
    for(let item of data!.relatedCourses) {
      router.prefetch(item.href)
    }
  }

  return (
    <>
    <Head>
      <title>{staticInstructorName} / CougarGrades.io</title>
      <meta name="description" content={staticMetaDescription} />
    </Head>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.instructorHero}>
          <figure>
            { !isMissingProps ? <Typography variant="h1">{staticInstructorName}</Typography> : <CustomSkeleton width={325} height={75} />}
            { !isMissingProps ? <Typography variant="h4">{staticDepartmentText}</Typography> : <CustomSkeleton width={360} height={45} /> }
            <div>
              {status === 'success' ? data!.badges.map(e => (
                <Tooltip key={e.key} title={e.caption ?? ''}>
                  <Box component="span">
                    <Badge style={{ backgroundColor: e.color, marginRight: '0.35rem' }}>{e.text}</Badge>
                  </Box>
                </Tooltip>
              )) : [1,2,3].map(e => (
                <BadgeSkeleton key={e} style={{ marginRight: '0.35rem' }}/>
              ))}
            </div>
          </figure>
        </div>
        <div className={styles.rmpLink}>
          { status === 'success' && data!.rmpHref !== undefined ? <>
            <Link href={data!.rmpHref} passHref>
              <Button variant="text" size="small" color="info" className={interactivity.hoverActive} startIcon={<RateReviewIcon />}>
                Linked with RateMyProfessors.com
              </Button>
            </Link>
            </> : null
          }
        </div>
        { status === 'success' ? <>
          <EnrollmentInfo className={styles.enrollmentBar} data={data!.enrollment} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <h3>Basic Information</h3>
        <ul>
          <li>Earliest record: { status === 'success' ? data!.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Latest record: { status === 'success' ? data!.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of courses: { status === 'success' ? data!.courseCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of sections: { status === 'success' ? data!.sectionCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <Tooltip placement="bottom-start" title={`Estimated average size of each section, # of total enrolled ÷ # of sections. Excludes "empty" sections.`}>
            <li>Average number of students per section: { status === 'success' ? data!.classSize < 0 ? 'N/A' : `~ ${data?.classSize.toFixed(1)}` : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          </Tooltip>
        </ul>
        <h3>Related Groups</h3>
        { status === 'success' ? data!.relatedGroups.map(e => (
          <Tooltip key={e.key} title={e.description}>
            <Chip label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.href} clickable />
          </Tooltip>
        )) : [1].map(e => <CustomSkeleton key={e} width={150} height={32} />)}
        <h3>Related Courses</h3>
        <Carousel>
          { status === 'success' ? data!.relatedCourses.slice(0,RELATED_COURSE_LIMIT).map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>
          ) : Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
        </Carousel>
        <h3>Data</h3>
      </main>
    </Container>
    <Container maxWidth="xl">
      <div className={styles.chartWrap}>
        {
          status === 'success' && data!.dataChart.data.length > 0 ?
          <Chart
            width={'100%'}
            height={450}
            chartType="LineChart"
            loader={<CustomSkeleton width={'100%'} height={350} />}
            data={data!.dataChart.data}
            options={data!.dataChart.options}
            // prevent ugly red box when there's no data yet on first-mount
            chartEvents={[{ eventName: 'error', callback: (event) => event.google.visualization.errors.removeError(event.eventArgs[0].id) }]}
          />
          :
          <LoadingBoxIndeterminate title="Loading sections..." />
        }
      </div>
    </Container>
    <Container>
      <main>
        <EnhancedTable<CoursePlus>
          title="Courses"
          columns={status === 'success' ? data!.courseDataGrid.columns : []}
          rows={status === 'success' ? data!.courseDataGrid.rows : []}
          defaultOrderBy="id"
        />
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={status === 'success' ? data!.sectionDataGrid.columns : []}
          rows={status === 'success' ? data!.sectionDataGrid.rows : []}
          defaultOrder="desc"
          defaultOrderBy="term"
        />
      </main>
    </Container>
    </>
  )
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/instructors.json')
  return {
    paths: [
      //{ params: { courseName: '' } },
      // Uncomment when this bug is fixed: https://github.com/cougargrades/web/issues/128
      //...(buildArgs.vercelEnv === 'production' ? data.map(e => ( { params: { instructorName: e.legalName }})) : [])
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<InstructorProps> = async (context) => {
  //console.time('getStaticProps')
  const { params } = context;
  const instructorName = params?.instructorName;
  const instructorData = await getFirestoreDocument<Instructor>(`/instructors/${instructorName}`)
  const departmentText = getDepartmentText(instructorData)
  const metaDescription = metaInstructorDescription({
    staticInstructorName: extract(instructorName),
    staticFullInstructorName: instructorData !== undefined 
      ? `${instructorData.firstName} ${instructorData.lastName}`
      : extract(instructorName),
    staticDepartmentText: getDepartmentText(instructorData, 1),
  }, instructorData)
  //console.timeEnd('getStaticProps')

  return {
    props: {
      staticInstructorName: extract(instructorName),
      staticDepartmentText: departmentText,
      staticMetaDescription: metaDescription,
      doesNotExist: instructorData === undefined,
    }
  };
}

function getDepartmentText(data: Instructor | undefined, entries: number = 3) {
  // sort department entries in descending by value
  if(data !== undefined) {
    const depts: [keyof typeof abbreviationMap, number][] = Object.entries(data.departments) as any;

    const text = depts // [string, number][]
      .sort((a, b) => b[1] - a[1]) // sort
      .slice(0, entries) // limit to 3 entries
      .map(e => abbreviationMap[e[0]]) // ['MATH'] => ['Mathematics']
      .filter(e => e !== undefined) // remove those that didn't have an abbreviation
      .join(', '); // 'Mathematics, Computer Science'
    return text;
  }
  return ''
}
