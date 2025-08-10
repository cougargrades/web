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
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import RateReviewIcon from '@mui/icons-material/RateReview'
import Tilty from 'react-tilty'
import { Chart } from 'react-google-charts'
import { Instructor } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { PankoRow } from '../../components/panko'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { EnrollmentInfo } from '../../components/enrollment'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard'
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
import { RMPLauncher, useSearchRMP } from '../../lib/data/useSearchRMP'
import { SeasonalAvailabilityInfo } from '@/components/SeasonalAvailabilityInfo'

import styles from './instructor.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import { EnrollmentOverTimeInfo } from '@/components/EnrollmentOverTime'
import Grid from '@mui/material/Grid'


export interface InstructorProps {
  staticInstructorName: string;
  staticInstructorFirstName: string;
  staticInstructorLastName: string;
  staticDepartmentText: string;
  staticShortDepartmentText?: string;
  staticFullInstructorName?: string;
  staticMetaDescription: string;
  doesNotExist?: boolean;
}

export default function IndividualInstructor({ staticInstructorName, staticInstructorFirstName, staticInstructorLastName, staticDepartmentText, staticMetaDescription, doesNotExist }: InstructorProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useInstructorData(staticInstructorName)
  const { data: rmpData, status: rmpStatus } = useSearchRMP(staticInstructorFirstName, staticInstructorLastName);
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
          {
            (doesNotExist === true) ?
            <Alert severity="error">
              <AlertTitle>Error 404</AlertTitle>
              Instructor &quot;<code className="plain">{staticInstructorName}</code>&quot; could not be found.
            </Alert>
            : null
          }
          {
            (status === 'error' && doesNotExist === false) ?
            <Alert severity="error">
              <AlertTitle>Unknown Error</AlertTitle>
              An error occured when generating this page.
            </Alert>
            : null
          }
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
          {
            rmpStatus === 'success' && Array.isArray(rmpData) && rmpData.length > 0
            ? <RMPLauncher instructorFirstName={staticInstructorFirstName} instructorLastName={staticInstructorLastName} data={rmpData} />
            // Fallback to the old button if there's a problem with the live RMP integration
            : (
              status === 'success' && data?.rmpHref !== undefined
              ? <>
              <Button 
                variant="text"
                size="small"
                color="info"
                className={interactivity.hoverActive}
                startIcon={<RateReviewIcon />}
                href={data.rmpHref}
                target="_blank"
                rel="noreferrer"
                >
                Linked with RateMyProfessors.com
              </Button>
            </>
            : null
            )
          }
        </div>
        { status === 'success' ? <>
          <EnrollmentInfo className={styles.enrollmentBar} data={data!.enrollment} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <h3 style={{ width: '90%' }}>Basic Information</h3>
            <ul>
              <li>Earliest record: { status === 'success' ? data!.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Latest record: { status === 'success' ? data!.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Number of courses: { status === 'success' ? data!.courseCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Number of sections: { status === 'success' ? data!.sectionCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>
                <Tooltip arrow disableInteractive title={`Estimated average size of each section, # of total enrolled ÷ # of sections. Excludes "empty" sections.`}>
                  <span>Average number of students per section: { status === 'success' ? data!.classSize < 0 ? 'N/A' : `~ ${data?.classSize.toFixed(1)}` : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</span>
                </Tooltip>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <h3 style={{ width: '90%' }}>Seasonal Availability</h3>
            {
              status === 'success'
              ? <SeasonalAvailabilityInfo style={{ paddingTop: '10px' }} seasonalAvailability={data!.seasonalAvailability} />
              : <CustomSkeleton width={'100%'} height={12} margin={0} />
            }
          </Grid>
        </Grid>
        <h3>Related Groups</h3>
        {
          status === 'success' 
          ? (
            data!.relatedGroups.length > 0
            ? (
              data!.relatedGroups.map(e => (
                <Tooltip key={e.key} title={e.description}>
                  <Chip label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.href} clickable />
                </Tooltip>
              )) 
            )
            : (
              <span>No data</span>
            )
          )
          : [1].map(e => <CustomSkeleton key={e} width={150} height={32} />)
        }
        <h3>Related Courses</h3>
        {
          status === 'success'
          ? (
            data!.relatedCourses.length > 0
            ? (
              <Carousel>
                {
                  data!.relatedCourses.slice(0,RELATED_COURSE_LIMIT).map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>)
                }
                {/* I forgot there was an intentional reason why this wasn't included here */}
                {
                  false && data!.relatedCourses.length > RELATED_COURSE_LIMIT
                  ? <InstructorCardShowMore
                      cardTitle={`View all courses from ${staticInstructorName}`}
                      modalTitle={`Courses from ${staticInstructorName}`}
                      data={data!.relatedCourses}
                    />
                  : null
                }
              </Carousel>
              
            )
            : (
              <span>No data</span>
            )
          )
          : (
            <Carousel>
              {Array.from(new Array(RELATED_COURSE_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
            </Carousel>
          )
        }
        <h3 style={{ marginBottom: '16px' }}>Enrollment Data</h3>
        <div className={styles.enrollmentOverTimeWrap}>
          <div className={styles.enrollmentOverTime}>
            {
              status === 'success'
              ? (
                data?.enrollmentSparklineData !== undefined
                ? <>
                  <EnrollmentOverTimeInfo chartTitle={`${staticInstructorFirstName} ${staticInstructorLastName} Enrollment Over Time by Semester`} enrollmentSparklineData={data.enrollmentSparklineData} />
                </>
                : <>
                  <div style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    No chart data 📉🗑️
                  </div>
                </>
              )
              : <>
                <LoadingBoxIndeterminate title="Loading sections..." />
              </>
            }
          </div>
        </div>
        <h3>Grade Data</h3>
      </main>
    </Container>
    <Container maxWidth="xl">
      <div className={styles.chartWrap}>
        {
          status === 'success'
          ? (
            data!.dataChart.data.length > 0
            ? (
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
            )
            : (
              <div style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                No chart data 📉🗑️
              </div>
            )
          )
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
  //console.log(`[getStaticPaths] /i/[instructorName], ${data.length} instructors`);
  return {
    paths: [
      //{ params: { courseName: '' } },
      // Uncomment when this bug is fixed: https://github.com/cougargrades/web/issues/128
      ...(['production'].includes(buildArgs.vercelEnv) ? data.map(e => ( { params: { instructorName: e.legalName.toLowerCase() }})) : [])
    ],
    //fallback: true, // Do front-end ISR when the page isn't already generated
    fallback: 'blocking', // Do server-side ISR when the page isn't already generated
  }
}

export const getStaticProps: GetStaticProps<InstructorProps> = async (context) => {
  //console.time('getStaticProps')
  const { params } = context;
  const instructorName = extract(params?.instructorName);
  const instructorData = await getFirestoreDocument<Instructor>(`/instructors/${instructorName.toLowerCase()}`)
  const instructorNameCapitalized = instructorData !== undefined ? `${instructorData.lastName}, ${instructorData.firstName}` : instructorName;
  const departmentText = getDepartmentText(instructorData)
  const metaDescription = metaInstructorDescription({
    staticInstructorName: instructorName,
    staticFullInstructorName: instructorData !== undefined 
      ? `${instructorData.firstName} ${instructorData.lastName}`
      : instructorName,
    staticDepartmentText: getDepartmentText(instructorData, 1),
  }, instructorData)
  //console.timeEnd('getStaticProps')

  return {
    props: {
      staticInstructorName: instructorNameCapitalized,
      staticInstructorFirstName: instructorData?.firstName ?? '',
      staticInstructorLastName: instructorData?.lastName ?? '',
      staticDepartmentText: departmentText,
      staticMetaDescription: metaDescription,
      doesNotExist: instructorData === undefined,
    },
    revalidate: false
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
