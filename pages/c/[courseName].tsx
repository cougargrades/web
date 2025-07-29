import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import useSWR from 'swr/immutable'
import Container from '@mui/material/Container'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Tilty from 'react-tilty'
import { Chart } from 'react-google-charts'
import { Course, PublicationInfo } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { SectionPlus, useCourseData } from '../../lib/data/useCourseData'
import { getFirestoreDocument } from '../../lib/data/back/getFirestoreData'
import { useRosetta } from '../../lib/i18n'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { defaultComparator, EnhancedTable } from '../../components/datatable'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard'
import { EnrollmentInfo } from '../../components/enrollment'
import { CustomSkeleton } from '../../components/skeleton'
import { LoadingBoxIndeterminate, LoadingBoxLinearProgress } from '../../components/loading'
import { TCCNSUpdateNotice } from '../../components/tccnsupdatenotice'
import { extract } from '../../lib/util'
import { buildArgs } from '../../lib/environment'
import { metaCourseDescription } from '../../lib/seo'
import { SimpleSyllabusLauncher, useSearchSimpleSyllabus } from '../../lib/data/useSearchSimpleSyllabus'

import styles from './course.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export interface CourseProps {
  staticCourseName: string;
  staticDescription: string;
  staticLongDescription?: string;
  staticMetaDescription: string;
  staticHTML: string;
  doesNotExist?: boolean;
}

export default function IndividualCourse({ staticCourseName, staticDescription, staticMetaDescription, staticHTML, doesNotExist }: CourseProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useCourseData(staticCourseName)
  const { data: sylData, status: sylStatus } = useSearchSimpleSyllabus(staticCourseName)
  const isMissingProps = staticCourseName === undefined
  const RELATED_INSTRUCTOR_LIMIT = 4;

  if(status === 'success') {
    // preload referenced areas
    for(let item of data!.relatedGroups) {
      router.prefetch(item.href)
    }
    for(let item of data!.relatedInstructors) {
      router.prefetch(item.href)
    }
  }

  const tccnsUpdateAsterisk = status === 'success' && data!.tccnsUpdates.length > 0 ? <Tooltip title={`${staticCourseName} has been involved in some course number changes by UH.`} placement="right"><span>*</span></Tooltip> : null;

  return (
    <>
    <Head>
      <title>{staticCourseName} / CougarGrades.io</title>
      <meta name="description" content={staticMetaDescription} />
    </Head>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          {
            (doesNotExist === true) ?
            <Alert severity="error">
              <AlertTitle>Error 404</AlertTitle>
              Course &quot;<code className="plain">{staticCourseName}</code>&quot; could not be found.
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
            { !isMissingProps ? <h3>{staticDescription}</h3> : <CustomSkeleton width={360} height={45} /> }
            { !isMissingProps ? <h1 className={styles.display_3}>{staticCourseName}{tccnsUpdateAsterisk}</h1> : <CustomSkeleton width={325} height={75} />}
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
        <div className={styles.tccnsUpdateLinks}>
          { status === 'success' ? data!.tccnsUpdates.map((value, index) => (
            <TCCNSUpdateNotice key={index} data={value} />
          )) : null}
          {
            sylStatus === 'success' && sylData !== null && sylData?.sys.success === true && sylData.items.length > 0
            ? <SimpleSyllabusLauncher data={sylData} courseName={staticCourseName} />
            : null
          }
        </div>
        { !isMissingProps ? 
          <div dangerouslySetInnerHTML={{ __html: staticHTML }}></div>
          : 
          <CustomSkeleton width={'100%'} height={125} />
         }
        { status === 'success' && data?.publications.length === 0 ? null : <h6>Sources:</h6> }
        { status === 'success' ? data!.publications.map(e => (
          <Tooltip key={e.key} title={`Scraped on ${new Date(e.scrapeDate).toLocaleString()}`}>
            <Chip label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
          </Tooltip>
        )) : [1,2].map(e => <CustomSkeleton key={e} width={230} height={32} display="inline-block" />)}
        { status === 'success' ? <>
          <EnrollmentInfo className={styles.enrollmentBar} data={data!.enrollment} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <h3>Basic Information</h3>
        <ul>
          <li>Earliest record: { status === 'success' ? data!.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Latest record: { status === 'success' ? data!.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of instructors: { status === 'success' ? data!.instructorCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <li>Number of sections: { status === 'success' ? data!.sectionCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          <Tooltip placement="bottom-start" title={`Estimated average size of each section, # of total enrolled ÷ # of sections. Excludes "empty" sections.`}>
            <li>Average number of students per section: { status === 'success' ? data!.classSize < 0 ? 'N/A' : `~ ${data?.classSize.toFixed(1)}` : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
          </Tooltip>
        </ul>
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
          : (
            [1,2,3].map(e => <CustomSkeleton key={e} width={150} height={32} display="inline-block" />)
          )
        }
        <h3>Related Instructors</h3>
        {
          status === 'success' 
          ? (
            data!.relatedInstructors.length > 0
            ? (
              <Carousel>
                {
                  data!.relatedInstructors
                  .slice(0,RELATED_INSTRUCTOR_LIMIT)
                  .map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>)
                }
                {
                  data!.relatedInstructors.length > RELATED_INSTRUCTOR_LIMIT
                  ? <InstructorCardShowMore
                      cardTitle={`View all ${staticCourseName} instructors`}
                      modalTitle={`All ${staticCourseName} instructors`}
                      data={data!.relatedInstructors} 
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
              {Array.from(new Array(RELATED_INSTRUCTOR_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
            </Carousel>
          )
        }
        <h3>Data</h3>
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
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={status === 'success' ? data!.dataGrid.columns : []}
          rows={status === 'success' ? data!.dataGrid.rows : []}
          defaultOrder="desc"
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
  const { data } = await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')
  //console.log(`[getStaticPaths] /c/[courseName], ${data.length} courses`);
  return {
    paths: [
      //{ params: { courseName: '' } },
      // Uncomment when this bug is fixed: https://github.com/cougargrades/web/issues/128
      ...(['production'].includes(buildArgs.vercelEnv) ? data.map(e => ( { params: { courseName: e.courseName }})) : [])
    ],
    //fallback: true, // Do front-end ISR when the page isn't already generated
    fallback: 'blocking', // Do server-side ISR when the page isn't already generated
  }
}

export const getStaticProps: GetStaticProps<CourseProps> = async (context) => {
  //console.time('getStaticProps')
  const { params, locale } = context;
  const courseName = params?.courseName;
  const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const { data: searchableData } = await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')
  const description = courseData !== undefined ? courseData.description : ''
  const longDescription = searchableData.find(e => e.courseName === courseName)?.publicationTextContent ?? '';
  const metaDescription = metaCourseDescription({
    staticCourseName: extract(courseName),
    staticDescription: description,
    staticLongDescription: longDescription,
  })
  const recentPublication = courseData && courseData.publications !== undefined && 
    Array.isArray(courseData.publications) &&
    courseData.publications.length > 0
    ? 
    courseData.publications.sort((a,b) => defaultComparator(a.catoid, b.catoid))[0]
    :
    undefined;
  const { content } = recentPublication || {}
  //console.timeEnd('getStaticProps')

  return { 
    props: { 
      staticCourseName: extract(courseName),
      staticDescription: description,
      staticLongDescription: longDescription,
      staticMetaDescription: metaDescription,
      staticHTML: content ?? '',
      doesNotExist: courseData === undefined,
    },
    revalidate: false
  };

}

