import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { Alert, AlertTitle, Box, Chip, Container, Grid, Skeleton, Tooltip } from '@mui/material'
import { metaCourseDescription } from '@cougargrades/models';
import type { SectionPlus } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import { defaultComparator } from '@cougargrades/utils/comparator';
import Tilty from 'react-tilty'
import { Chart } from 'react-google-charts'
import { courseDataQueryOptions, useCourseData } from '../../lib/services/useCourseData'
import { useSearchSimpleSyllabus } from '../../lib/services/useSearchSimpleSyllabus';
import { PankoRow } from '../../components/panko';
import { CustomSkeleton } from '../../components/skeleton';
import { Badge, BadgeSkeleton } from '../../components/badge';
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard';
import { LoadingBoxIndeterminate } from '../../components/loading';
import { EnhancedTable } from '../../components/datatable';
import { TCCNSUpdateNotice } from '../../components/tccnsupdatenotice';
import { EnrollmentInfo } from '../../components/enrollment';
import { SeasonalAvailabilityInfo } from '../../components/SeasonalAvailabilityInfo';
import { EnrollmentOverTimeInfo } from '../../components/EnrollmentOverTime';
import { Carousel } from '../../components/carousel';
import { SimpleSyllabusLauncher } from '../../components/SimpleSyllabus';


import styles from './course.module.scss'
import interactivity from '../../styles/interactivity.module.scss'


export const Route = createFileRoute('/c/$courseName')({
  async loader(ctx) {
    const queryOptions = courseDataQueryOptions(ctx.params.courseName);
    const data = await ctx.context.queryClient.ensureQueryData(queryOptions);
    if (isNullish(data)) {
      throw notFound();
    }
    return data;
  },
  head: (ctx) => {
    const data = ctx.loaderData
    const metaDescription = metaCourseDescription({
      ...(data ?? {})
    })
    return {
      meta: [
        { title: `${ctx.params.courseName} / CougarGrades.io` },
        { name: 'description', content: `${metaDescription}` }
      ]
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const { courseName } = Route.useParams();
  const router = useRouter();

  const { data, status, isPending } = useCourseData(courseName)
  const { data: sylData, status: sylStatus } = useSearchSimpleSyllabus(courseName)
  const DID_LOAD = status === 'success' && !isNullish(data);

  const staticHTML = (
    !isNullish(data) && !isNullish(data.publications) && data.publications.length > 0
    ? data.publications.toSorted((a,b) => defaultComparator(a.catoid, b.catoid))[0].content
    : null
  );

  const RELATED_INSTRUCTOR_LIMIT = 4;
  const tccnsUpdateAsterisk = (
    status === 'success' && !isNullish(data) && data.tccnsUpdates.length > 0
    ? (
      <Tooltip arrow disableInteractive placement="right" title={`${courseName} has been involved in some course number changes by UH.`}>
        <span>*</span>
      </Tooltip>
    )
    : null
  );



  return (
    <>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          {
            (status === 'error') ?
            <Alert severity="error">
              <AlertTitle>Unknown Error</AlertTitle>
              An error occured when generating this page.
            </Alert>
            : null
          }
          <figure>
            { !isPending ? <h3>{data?.description ?? ''}</h3> : <CustomSkeleton width={360} height={45} /> }
            { !isPending ? <h1 className={styles.display_3}>{courseName}{tccnsUpdateAsterisk}</h1> : <CustomSkeleton width={325} height={75} />}
            <div>
              {status === 'success' ? data?.badges.map(e => (
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
          {
            status === 'success'
            ? (
              !isNullish(data) && data.tccnsUpdates.length > 0
              ? data.tccnsUpdates.map((value, index) => (
                <TCCNSUpdateNotice key={index} data={value} />
              ))
              : null
            )
            : <CustomSkeleton width={140} height={30} />
          }
          {
            sylStatus === 'success'
            ? (
              sylData.items.length > 0
              ? <SimpleSyllabusLauncher data={sylData} courseName={courseName} />
              : null
            )
            : <CustomSkeleton width={140} height={30} />
          }
        </div>
        { !isPending ? 
          <div dangerouslySetInnerHTML={{ __html: staticHTML ?? '' }}></div>
          : 
          <CustomSkeleton width={'100%'} height={125} />
         }
        { status === 'success' && data?.publications.length === 0 ? null : <h6>Sources:</h6> }
        { status === 'success' ? data?.publications.map(e => (
          <Tooltip key={e.key} title={`Scraped on ${new Date(e.scrapeDate).toLocaleString()}`}>
            <Chip label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
          </Tooltip>
        )) : [1,2].map(e => <CustomSkeleton key={e} width={230} height={32} display="inline-block" />)}
        { status === 'success' ? <>
          <EnrollmentInfo className={styles.enrollmentBar} data={data?.enrollment ?? []} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <Grid container spacing={0}>
          <Grid size={{ xs: 12, md: 6 }}>
            <h3 style={{ width: '90%' }}>Basic Information</h3>
            <ul>
              <li>Earliest record: { status === 'success' ? data?.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Latest record: { status === 'success' ? data?.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Number of instructors: { status === 'success' ? data?.instructorCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Number of sections: { status === 'success' ? data?.sectionCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>
                <Tooltip arrow disableInteractive title={`Estimated average size of each section, # of total enrolled ÷ # of sections. Excludes "empty" sections.`}>
                  <span>
                    Average number of students per section:{' '} 
                    {
                      status === 'success'
                      ? (
                        isNullish(data) || data.classSize < 0
                        ? 'N/A'
                        : `~ ${data?.classSize.toFixed(1)}`
                      )
                      : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} />
                      }
                  </span>
                </Tooltip>
              </li>
            </ul>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <h3 style={{ width: '90%' }}>Seasonal Availability</h3>
            {
              DID_LOAD
              ? <SeasonalAvailabilityInfo style={{ paddingTop: '10px' }} seasonalAvailability={data.seasonalAvailability} />
              : <CustomSkeleton width={150} height={150} margin={0} />
            }
          </Grid>
        </Grid>
        <h3>Related Groups</h3>
        {
          DID_LOAD
          ? (
              data.relatedGroups.length > 0
              ? (
                data.relatedGroups.map(e => (
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
          DID_LOAD
          ? (
            data.relatedInstructors.length > 0
            ? (
              <Carousel>
                {
                  data.relatedInstructors
                  .slice(0,RELATED_INSTRUCTOR_LIMIT)
                  .map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>)
                }
                {
                  data.relatedInstructors.length > RELATED_INSTRUCTOR_LIMIT
                  ? <InstructorCardShowMore
                      cardTitle={`View all ${courseName} instructors`}
                      modalTitle={`All ${courseName} instructors`}
                      data={data.relatedInstructors} 
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
        <h3 style={{ marginBottom: '16px' }}>Enrollment Data</h3>
        {
          status === 'success'
          ? (
            data?.enrollmentSparklineData !== undefined
            ? <>
              <EnrollmentOverTimeInfo chartTitle={`${courseName} Enrollment Over Time by Semester`} enrollmentSparklineData={data.enrollmentSparklineData} />
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
        <h3>Grade Data</h3>
      </main>
    </Container>
    <Container maxWidth="xl">
      <div className={styles.chartWrap}>
        {
          status === 'success'
          ? (
            DID_LOAD && data.dataChart.data.length > 0
            ? (
              <Chart
                width={'100%'}
                height={450}
                chartType="LineChart"
                loader={<CustomSkeleton width={'100%'} height={350} />}
                data={data.dataChart.data}
                options={data.dataChart.options}
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
          columns={DID_LOAD ? data.dataGrid.columns : []}
          rows={DID_LOAD ? data.dataGrid.rows : []}
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

function NotFoundComponent() {
  const { courseName } = Route.useParams();

  return (
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          <Alert severity="error">
            <AlertTitle>Error 404</AlertTitle>
            Course &quot;<code className="plain">{courseName}</code>&quot; could not be found.
          </Alert>
          <div style={{ height: '200px' }}></div>
        </div>
      </main>
    </Container>
  )
}
