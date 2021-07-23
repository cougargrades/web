import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '@material-ui/core/Container'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Skeleton from '@material-ui/core/Skeleton'
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid'
import { Course } from '@cougargrades/types'
import { PankoRow } from '../../components/panko'
import { SectionPlus, useCourseData } from '../../lib/data/useCourseData'
import { onlyOne, getFirestoreDocument, getFirestoreCollection } from '../../lib/ssg'
import { useRosetta } from '../../lib/i18n'
import { isMobile, sum } from '../../lib/util'
import { useIsMobile } from '../../lib/hook'
import { Badge, BadgeSkeleton } from '../../components/badge'
import { Column, EnhancedTable } from '../../components/datatable'
import { Carousel } from '../../components/carousel'
import { InstructorCard, InstructorCardShowMore, InstructorCardSkeleton } from '../../components/instructorcard'
import { CustomSkeleton } from '../../components/skeleton'
import { buildArgs } from '../../lib/environment'
import styles from './course.module.scss'

interface Data {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  nested: {
    value: number;
  }
}

const columns: Column<Data>[] = [
  { field: 'name', headerName: 'Dessert (100g serving)', type: 'string' },
  { field: 'calories', headerName: 'Calories', type: 'number' },
  { field: 'fat', headerName: 'Fat (g)', type: 'number' },
  { field: 'carbs', headerName: 'Carbs (g)', type: 'number' },
  { field: 'protein', headerName: 'Protein (g)', type: 'number' },
  { 
    field: 'nested', headerName: 'Protein (mg)', type: 'object', 
    sortComparator: (a, b) => b.nested.value < a.nested.value ? -1 : b.nested.value > a.nested.value ? 1 : 0,
    valueFormatter: x => x.value.toExponential()
  }
];

const rows: Data[] = ([
  {
    "name": "Cupcake",
    "calories": 305,
    "fat": 3.7,
    "carbs": 67,
    "protein": 4.3
  },
  {
    "name": "Donut",
    "calories": 452,
    "fat": 25,
    "carbs": 51,
    "protein": 4.9
  },
  {
    "name": "Eclair",
    "calories": 262,
    "fat": 16,
    "carbs": 24,
    "protein": 6
  },
  {
    "name": "Frozen yoghurt",
    "calories": 159,
    "fat": 6,
    "carbs": 24,
    "protein": 4
  },
  {
    "name": "Gingerbread",
    "calories": 356,
    "fat": 16,
    "carbs": 49,
    "protein": 3.9
  },
  {
    "name": "Honeycomb",
    "calories": 408,
    "fat": 3.2,
    "carbs": 87,
    "protein": 6.5
  },
  {
    "name": "Ice cream sandwich",
    "calories": 237,
    "fat": 9,
    "carbs": 37,
    "protein": 4.3
  },
  {
    "name": "Jelly Bean",
    "calories": 375,
    "fat": 0,
    "carbs": 94,
    "protein": 0
  },
  {
    "name": "KitKat",
    "calories": 518,
    "fat": 26,
    "carbs": 65,
    "protein": 7
  },
  {
    "name": "Lollipop",
    "calories": 392,
    "fat": 0.2,
    "carbs": 98,
    "protein": 0
  },
  {
    "name": "Marshmallow",
    "calories": 318,
    "fat": 0,
    "carbs": 81,
    "protein": 2
  },
  {
    "name": "Nougat",
    "calories": 360,
    "fat": 19,
    "carbs": 9,
    "protein": 37
  },
  {
    "name": "Oreo",
    "calories": 437,
    "fat": 18,
    "carbs": 63,
    "protein": 4
  }
]).map(e => ({
  ...e,
  id: e.name,
  nested: {
    value: e.protein * 1000
  }
}));

export interface CourseProps {
  staticCourseName: string,
  staticDescription: string,
}

export default function IndividualCourse({ staticCourseName, staticDescription }: CourseProps) {
  const stone = useRosetta()
  const router = useRouter()
  const { data, status } = useCourseData(staticCourseName)
  const isMissingProps = staticCourseName === undefined || false
  const RELATED_INSTRUCTOR_LIMIT = 4;
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
        )) : [1,2].map(e => <CustomSkeleton key={e} width={230} height={32} />)}
        <hr />
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
          { status === 'success' ? data.relatedInstructors.slice(0,RELATED_INSTRUCTOR_LIMIT).map(e => <InstructorCard key={e.key} data={e} />
          ) : Array.from(new Array(RELATED_INSTRUCTOR_LIMIT).keys()).map(e => <InstructorCardSkeleton key={e} />)}
          { status === 'success' && data.relatedInstructors.length > RELATED_INSTRUCTOR_LIMIT ? <InstructorCardShowMore courseName={staticCourseName} data={data.relatedInstructors} /> : ''}
        </Carousel>
        <h3>Visualization</h3>
        <Box component="div" width={'100%'} height={150} style={{ backgroundColor: 'silver' }} />
        <h3>Data</h3>
        <EnhancedTable<SectionPlus>
          title="Past Sections"
          columns={data.dataGrid.columns}
          rows={data.dataGrid.rows}
          defaultOrderBy="term"
          minWidth={1010}
        />
        {/* <EnhancedTable<Data>
          title="Nutrition"
          columns={columns}
          rows={rows}
          defaultOrder="calories"
        /> */}
        {/* <Box component="div" className={styles.dataTableWrap}>
          { status === 'success' ? 
            // <DataGrid
            //   columns={data.dataGrid.columns}
            //   rows={data.dataGrid.rows}
            //   density="compact"
            //   autoHeight
            //   //pageSize={5}
            //   //rowsPerPageOptions={[10, 50, { value: -1, label: 'All' }]}
            //   //checkboxSelection
            //   disableSelectionOnClick
            // />
            
            :
            <CustomSkeleton width={'100%'} height={'100%'} />
          }
        </Box> */}
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
  const { params } = context;
  const { courseName } = params
  const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const description = courseData !== undefined ? courseData.description : ''
  //console.timeEnd('getStaticProps')

  return { 
    props: { 
      staticCourseName: onlyOne(courseName),
      staticDescription: description,
    }
  };
}

