import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { Alert, AlertTitle, Box, Button, Chip, Container, Grid, Skeleton, Tooltip, Typography } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview'
import { metaInstructorDescription } from '@cougargrades/models';
import type { CoursePlus, SectionPlus } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import Tilty from 'react-tilty';
import Chart from 'react-google-charts';
import { instructorDataQueryOptions, useInstructorData } from '../../lib/services/useInstructorData'
import { useSearchRMP } from '../../lib/services/useSearchRMP';
import { PankoRow } from '../../components/panko';
import { CustomSkeleton } from '../../components/skeleton';
import { Badge, BadgeSkeleton } from '../../components/badge';
import { EnrollmentInfo } from '../../components/enrollment';
import { SeasonalAvailabilityInfo } from '../../components/SeasonalAvailabilityInfo';
import { Carousel } from '../../components/carousel';
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard';
import { EnrollmentOverTimeInfo } from '../../components/EnrollmentOverTime';
import { LoadingBoxIndeterminate } from '../../components/loading';
import { EnhancedTable } from '../../components/datatable';
import { RMPLauncher } from '../../components/RMPLauncher';


import styles from './instructor.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export const Route = createFileRoute('/i/$instructorName')({
  async loader(ctx) {
    const queryOptions = instructorDataQueryOptions(ctx.params.instructorName);
    const data = await ctx.context.queryClient.ensureQueryData(queryOptions);
    if (isNullish(data)) {
      throw notFound();
    }
    return data;
  },
  head: (ctx) => {
    const data = ctx.loaderData
    const metaDescription = metaInstructorDescription({
      ...(data ?? {})
    })
    return {
      meta: [
        { title: `${data?.meta.fullName ?? ctx.params.instructorName} / CougarGrades.io` },
        { name: 'description', content: `${metaDescription}` }
      ]
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const { instructorName } = Route.useParams();

  const router = useRouter()
  const { data, status } = useInstructorData(instructorName)
  const { data: rmpData, status: rmpStatus } = useSearchRMP(`${data?.meta.firstName ?? ''} ${data?.meta.lastName ?? ''}`);
  const DID_LOAD = status === 'success' && !isNullish(data);


  const RELATED_COURSE_LIMIT = 4;

  return (
    <>
    <Container>
      <PankoRow />
      <main>
        <div className={styles.instructorHero}>
          {
            status === 'error' ?
            <Alert severity="error">
              <AlertTitle>Unknown Error</AlertTitle>
              An error occured when generating this page.
            </Alert>
            : null
          }
          <figure>
            { DID_LOAD ? <Typography variant="h1">{data.meta.fullNameLastNameFirst}</Typography> : <CustomSkeleton width={325} height={75} />}
            { DID_LOAD ? <Typography variant="h4">{data.meta.descriptionDepartmentsInvolved}</Typography> : <CustomSkeleton width={360} height={45} /> }
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
        <div className={styles.rmpLink}>
          {
            DID_LOAD && rmpStatus === 'success' && Array.isArray(rmpData) && rmpData.length > 0
            ? <RMPLauncher instructorFirstName={data.meta.firstName} instructorLastName={data.meta.lastName} data={rmpData} />
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
          <EnrollmentInfo className={styles.enrollmentBar} data={data?.enrollment ?? []} barHeight={12} />          
        </> : <CustomSkeleton width={'100%'} height={12} margin={0} /> }
        <Grid container spacing={0}>
          <Grid size={{ xs: 12, md: 6 }}>
            <h3 style={{ width: '90%' }}>Basic Information</h3>
            <ul>
              <li>Earliest record: { status === 'success' ? data?.firstTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Latest record: { status === 'success' ? data?.lastTaught : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
              <li>Number of courses: { status === 'success' ? data?.courseCount : <Skeleton variant="text" style={{ display: 'inline-block' }} width={80} height={25} /> }</li>
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
              : <CustomSkeleton width={'100%'} height={12} margin={0} />
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
                <Tooltip key={e.identifier} title={e.description}>
                  <Chip label={e.shortName ?? e.name} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.href} clickable />
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
          DID_LOAD
          ? (
            data.relatedCourses.length > 0
            ? (
              <Carousel>
                {
                  data.relatedCourses.slice(0,RELATED_COURSE_LIMIT).map(e => <Tilty key={e.key} max={25}><InstructorCard data={e} /></Tilty>)
                }
                {/* 20??-??-??: I forgot there was an intentional reason why this wasn't included here */}
                {/* 2026-03-01: I think it was because seeing a big list of course numbers was meaningless, but I added descriptions to the ListItems so it looks better now */}
                {
                  true && data.relatedCourses.length > RELATED_COURSE_LIMIT
                  ? <InstructorCardShowMore
                      cardTitle={`View all courses from ${data.meta.fullName}`}
                      modalTitle={`Courses from ${data.meta.fullName}`}
                      data={data.relatedCourses}
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
        {
          status === 'success'
          ? (
            data?.enrollmentSparklineData !== undefined
            ? <>
              <EnrollmentOverTimeInfo chartTitle={`${data.meta.firstName} ${data.meta.lastName} Enrollment Over Time by Semester`} enrollmentSparklineData={data.enrollmentSparklineData} />
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
          DID_LOAD
          ? (
            data.dataChart.data.length > 0
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
        <EnhancedTable<CoursePlus>
          title="Courses"
          columns={DID_LOAD ? data.courseDataGrid.columns : []}
          rows={DID_LOAD ? data.courseDataGrid.rows : []}
          defaultOrderBy="id"
        />
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={DID_LOAD ? data.sectionDataGrid.columns : []}
          rows={DID_LOAD ? data.sectionDataGrid.rows : []}
          defaultOrder="desc"
          defaultOrderBy="term"
        />
      </main>
    </Container>
    </>
  )
}

function NotFoundComponent() {
  const { instructorName } = Route.useParams();

  return (
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          <Alert severity="error">
            <AlertTitle>Error 404</AlertTitle>
            Instructor &quot;<code className="plain">{instructorName}</code>&quot; could not be found.
          </Alert>
          <div style={{ height: '200px' }}></div>
        </div>
      </main>
    </Container>
  )
}
