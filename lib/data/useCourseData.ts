import { useEffect, useState } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { usePrevious } from 'react-use'
import { Course, Group, Instructor, PublicationInfo, TCCNSUpdateInfo, Section, Util, Enrollment } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { Observable } from './Observable'
import { SearchResultBadge } from './useSearchResults'
import { Grade, grade2Color } from '../../components/badge'
import { Column, defaultComparator, descendingComparator } from '../../components/datatable'
import { getRosetta, useRosetta } from '../i18n'
import { getYear, seasonCode, truncateWithEllipsis } from '../util'
import { getChartData } from './getChartData'
import { EnrollmentInfoResult } from '../../components/enrollment'
import { getBadges } from './getBadges'
import { useFakeFirestore } from '../firebase'
import { getFirestoreDocument } from '../ssg'

export type SectionPlus = Section & {
  id: string,
  primaryInstructorName: string,
};

export interface CourseResult {
  //course: Course;
  badges: SearchResultBadge[];
  publications: (PublicationInfo & { key: string })[];
  firstTaught: string;
  lastTaught: string;
  relatedGroups: CourseGroupResult[];
  relatedInstructors: CourseInstructorResult[];
  dataGrid: {
    columns: Column<SectionPlus>[];
    rows: SectionPlus[];
  };
  dataChart: {
    data: any[],
    options: { [key: string ]: any }
  };
  enrollment: EnrollmentInfoResult[];
  instructorCount: number;
  sectionCount: number;
  classSize: number;
  sectionLoadingProgress: number;
  tccnsUpdates: TCCNSUpdateInfo[];
}

export interface CourseGroupResult {
  key: string;
  href: string;
  title: string;
  description: string;
  count: number;
}

export interface CourseInstructorResult {
  key: string; // used for react, same as document path
  href: string; // where to redirect the user when selected
  title: string; // typically the instructor's full name (ex: Tyler James Beck)
  subtitle: string; // typically the instructor's associated departments (ex: Applied Music, Music)
  caption: string; // typically the number of courses and sections (ex: 4 courses • 5 sections)
  badges: SearchResultBadge[];
  id: string;
  lastInitial: string;
}

export function group2Result(data: Group): CourseGroupResult {
  const isCoreCurrGroup = Array.isArray(data.categories) && data.categories.includes('#UHCoreCurriculum');
  const isSubjectGroup = Array.isArray(data.categories) && data.categories.includes('#UHSubject');
  const suffix = isCoreCurrGroup ? ' (Core)' : isSubjectGroup ? ' (Subject)' : '';
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: `${data.name}${suffix}`,
    description: data.description,
    count: Array.isArray(data.courses) ? data.courses.length : 0
  };
}

export function instructor2Result(data: Instructor): CourseInstructorResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    title: data.fullName,
    subtitle: generateSubjectString(data),
    caption: `${Array.isArray(data.courses) ? data.courses.length : 0} courses • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    lastInitial: data.lastName.charAt(0).toUpperCase()
  };
}

function generateSubjectString(data: Instructor | undefined): string {
  if(data !== undefined && data !== null && data.departments !== undefined && data.departments !== null) {
    const entries = Object.entries(data.departments).sort((a, b) => b[1] - a[1])
    if(entries.length > 0) {
      // The following attempts to prevent Instructor descriptions from being too long
      const CHARACTER_LIMIT = 70
      let numAllowedEntries = entries.length
      const try_attempt = () => entries.slice(0, numAllowedEntries).map(e => (abbreviationMap as any)[e[0]]).filter(e => e !== undefined).join(', ');
      while(try_attempt().length > CHARACTER_LIMIT) {
        numAllowedEntries--;
      }
      
      return try_attempt();
    }
  }
  return '';
}

/**
 * Used in serverless functions
 * @param courseName 
 * @returns 
 */
export async function getCourseData(courseName: string): Promise<CourseResult> {
  const stone = getRosetta()
  const data = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1

  const groupData: Group[] = [...(
    data && Array.isArray(data.groups) && Util.isDocumentReferenceArray(data.groups)
    ? await Util.populate<Group>(data.groups)
    : []
  )];
  const instructorData: Instructor[] = [...(
    data && Array.isArray(data.instructors) && Util.isDocumentReferenceArray(data.instructors)
    ? await Util.populate<Instructor>(data.instructors)
    : []
  )];
  const sectionData: Section[] = [...(
    data && Array.isArray(data?.sections) && Util.isDocumentReferenceArray(data.sections)
    ? await Util.populate<Section>(data.sections, 10, true)
    : []
  )];

  return {
    badges: [
      ...(didLoadCorrectly ? getBadges(data.GPA, data.enrollment) : []),
    ],
    publications: [
      ...(didLoadCorrectly && data.publications !== undefined && Array.isArray(data.publications) ? data.publications.map(e => (
        {
          ...e,
          key: `${e.catoid}|${e.coid}`
        }
      )).sort((a,b) => descendingComparator(a, b, 'catoid')).slice(0,3) : [])
    ],
    tccnsUpdates: [
      ...(didLoadCorrectly && data.tccnsUpdates !== undefined && Array.isArray(data.tccnsUpdates) ? data.tccnsUpdates : []),
    ],
    firstTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.firstTaught)}`)} ${getYear(data.firstTaught)}` : '',
    lastTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.lastTaught)}`)} ${getYear(data.lastTaught)}` : '',
    relatedGroups: [
      ...(didLoadCorrectly ? groupData.map(e => group2Result(e)) : [])
    ],
    relatedInstructors: [
      ...(didLoadCorrectly ? instructorData.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => instructor2Result(e)) : [])
    ],
    dataGrid: {
      columns: [
        {
          field: 'term',
          headerName: 'Term',
          type: 'number',
          width: 65,
          valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
        },
        {
          field: 'sectionNumber',
          headerName: 'Section #',
          type: 'number',
          width: 90,
        },
        {
          field: 'primaryInstructorName',
          headerName: 'Instructor',
          type: 'string',
          width: 95,
        },
        ...(['A','B','C','D','F','W','S','NCR']).map<Column<SectionPlus>>(e => ({
          field: e as any,
          headerName: e,
          description: `Number of ${e}s given for this section`,
          type: 'number',
          width: e !== 'NCR' ? 30 : 60,
          padding: 6,
        })),
        {
          field: 'semesterGPA',
          headerName: 'GPA',
          description: 'Grade Point Average for just this section',
          type: 'number',
          width: 60,
          padding: 8,
        } as any,
      ],
      rows: [
        ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
          id: e._id,
          primaryInstructorName: Array.isArray(e.instructorNames) ? `${e.instructorNames[0].lastName}, ${e.instructorNames[0].firstName}` : '',
          ...e,
        })) : [])
      ],
    },
    dataChart: {
      data: [
        ...(didLoadCorrectly ? getChartData(sectionData) : [])
      ],
      // https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en#configuration-options
      options: {
        title: `${courseName} Average GPA Over Time by Instructor`,
        vAxis: {
          title: 'Average GPA',
          gridlines: {
            count: -1 //auto
          },
          maxValue: 4.0,
          minValue: 0.0
        },
        hAxis: {
          title: 'Semester',
          gridlines: {
            count: -1 //auto
          },
          textStyle: {
            fontSize: 12
          },
        },
        chartArea: {
          //width: '100%',
          //width: '55%',
          //width: '65%',
          left: 'auto',
          //left: 65, // default 'auto' or 65
          right: 'auto',
          //right: 35, // default 'auto' or 65
          //left: (window.innerWidth < 768 ? 55 : (window.innerWidth < 992 ? 120 : null))
        },
        legend: {
          position: 'bottom'
        },
        pointSize: 5,
        interpolateNulls: true //lines between point gaps
      }
    },
    enrollment: [
      ...(didLoadCorrectly ? 
          data.enrollment.totalEnrolled === 0 ? 
          [{ key: 'nodata', title: 'No data', color: grade2Color.get('I')!, value: -1, percentage: 100 }] : 
          (['totalA','totalB','totalC','totalD','totalF','totalS','totalNCR','totalW'] as (keyof Enrollment)[])
          .map(k => ({
            key: k,
            title: k.substring(5), // 'totalA' => 'A'
            color: grade2Color.get(k.substring(5) as Grade) ?? grade2Color.get('I')!,
            value: data.enrollment[k],
            percentage: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? data.enrollment[k] / data.enrollment.totalEnrolled * 100 : 0,
          })
      ) : []),
    ],
    instructorCount: didLoadCorrectly ? Array.isArray(data.instructors) ? data.instructors.length : 0 : 0,
    sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
    classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
    sectionLoadingProgress: 100,
  };
}


/**
 * React hook for accessing the course data client-side
 * @param courseName 
 * @returns 
 * @deprecated
 */
export function useCourseData(courseName: string): Observable<CourseResult> {
  const stone = useRosetta()
  const db = useFakeFirestore()
  const { data, error, status } = useFirestoreDocData<Course>(db.doc(`/catalog/${courseName}`) as any)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const isBadObject = typeof data === 'object' && Object.keys(data).length === 1
  const isActualError = typeof courseName === 'string' && courseName !== '' && status !== 'loading' && isBadObject
  const [instructorData, setInstructorData] = useState<Instructor[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [sectionData, setSectionData] = useState<Section[]>([]);
  const [sectionLoadingProgress, setSectionLoadingProgress] = useState<number>(0);
  const previous = usePrevious(data?._id)
  const sharedStatus = status === 'success' ? isActualError ? 'error' : isBadObject ? 'loading' : didLoadCorrectly ? 'success' : 'error' : status

  // load courses + section + group data
  useEffect(() => {
    const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    // prevent loading the same data again
    if(didLoadCorrectly && previous !== data._id) {
      setInstructorData([]);
      setGroupData([]);
      setSectionData([]);
      setSectionLoadingProgress(0);
      (async () => {
        if(Array.isArray(data.groups) && Util.isDocumentReferenceArray(data.groups)) {
          setGroupData(await Util.populate<Group>(data.groups))
        }
        if(Array.isArray(data.instructors) && Util.isDocumentReferenceArray(data.instructors)) {
          setInstructorData(await Util.populate<Instructor>(data.instructors))
        }
        if(Array.isArray(data.sections) && Util.isDocumentReferenceArray(data.sections)) {
          console.count('course populate section')
          setSectionData(await Util.populate<Section>(data.sections, 10, true, (p,total) => setSectionLoadingProgress(p/total*100), false, false))
        }
      })();
    }
  }, [data,previous])

  try {
    return {
      data: {
        badges: [
          ...(didLoadCorrectly ? getBadges(data.GPA, data.enrollment) : []),
        ],
        publications: [
          ...(didLoadCorrectly && data.publications !== undefined && Array.isArray(data.publications) ? data.publications.map(e => (
            {
              ...e,
              key: `${e.catoid}|${e.coid}`
            }
          )).sort((a,b) => descendingComparator(a, b, 'catoid')).slice(0,3) : [])
        ],
        tccnsUpdates: [
          ...(didLoadCorrectly && data.tccnsUpdates !== undefined && Array.isArray(data.tccnsUpdates) ? data.tccnsUpdates : []),
        ],
        firstTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.firstTaught)}`)} ${getYear(data.firstTaught)}` : '',
        lastTaught: didLoadCorrectly ? `${stone.t(`season.${seasonCode(data.lastTaught)}`)} ${getYear(data.lastTaught)}` : '',
        relatedGroups: [
          ...(didLoadCorrectly ? groupData.map(e => group2Result(e)) : [])
        ],
        relatedInstructors: [
          ...(didLoadCorrectly ? instructorData.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => instructor2Result(e)) : [])
        ],
        dataGrid: {
          columns: [
            {
              field: 'term',
              headerName: 'Term',
              type: 'number',
              width: 65,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'sectionNumber',
              headerName: 'Section #',
              type: 'number',
              width: 90,
            },
            {
              field: 'primaryInstructorName',
              headerName: 'Instructor',
              type: 'string',
              width: 95,
            },
            ...(['A','B','C','D','F','W','S','NCR']).map<Column<SectionPlus>>(e => ({
              field: e as any,
              headerName: e,
              description: `Number of ${e}s given for this section`,
              type: 'number',
              width: e !== 'NCR' ? 30 : 60,
              padding: 6,
            })),
            {
              field: 'semesterGPA',
              headerName: 'GPA',
              description: 'Grade Point Average for just this section',
              type: 'number',
              width: 60,
              padding: 8,
            } as any,
          ],
          rows: [
            ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
              id: e._id,
              primaryInstructorName: Array.isArray(e.instructorNames) ? `${e.instructorNames[0].lastName}, ${e.instructorNames[0].firstName}` : '',
              ...e,
            })) : [])
          ],
        },
        dataChart: {
          data: [
            ...(didLoadCorrectly ? getChartData(sectionData) : [])
          ],
          // https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en#configuration-options
          options: {
            title: `${courseName} Average GPA Over Time by Instructor`,
            vAxis: {
              title: 'Average GPA',
              gridlines: {
                count: -1 //auto
              },
              maxValue: 4.0,
              minValue: 0.0
            },
            hAxis: {
              title: 'Semester',
              gridlines: {
                count: -1 //auto
              },
              textStyle: {
                fontSize: 12
              },
            },
            chartArea: {
              //width: '100%',
              //width: '55%',
              //width: '65%',
              left: 'auto',
              //left: 65, // default 'auto' or 65
              right: 'auto',
              //right: 35, // default 'auto' or 65
              //left: (window.innerWidth < 768 ? 55 : (window.innerWidth < 992 ? 120 : null))
            },
            legend: {
              position: 'bottom'
            },
            pointSize: 5,
            interpolateNulls: true //lines between point gaps
          }
        },
        enrollment: [
          ...(didLoadCorrectly ? 
              data.enrollment.totalEnrolled === 0 ? 
              [{ key: 'nodata', title: 'No data', color: grade2Color.get('I')!, value: -1, percentage: 100 }] : 
              (['totalA','totalB','totalC','totalD','totalF','totalS','totalNCR','totalW'] as (keyof Enrollment)[])
              .map(k => ({
                key: k,
                title: k.substring(5), // 'totalA' => 'A'
                color: grade2Color.get(k.substring(5) as Grade) ?? grade2Color.get('I')!,
                value: data.enrollment[k],
                percentage: data.enrollment[k] !== undefined && data.enrollment.totalEnrolled !== 0 ? data.enrollment[k] / data.enrollment.totalEnrolled * 100 : 0,
              })
          ) : []),
        ],
        instructorCount: didLoadCorrectly ? Array.isArray(data.instructors) ? data.instructors.length : 0 : 0,
        sectionCount: didLoadCorrectly ? Array.isArray(data.sections) ? data.sections.length : 0 : 0,
        classSize: didLoadCorrectly && Array.isArray(data.sections) ? data.enrollment.totalEnrolled / data.sections.length : 0,
        //sectionLoadingProgress: didLoadCorrectly ? Array.isArray(data.sections) ? (sectionLoadingProgress/data.sections.length*100) : 0 : 0,
        sectionLoadingProgress,
      },
      error,
      status: sharedStatus,
    }
  }
  catch(error) {
    console.error(`[useCourseData] Error:`, error)
    return {
      data: undefined,
      error: error as any,
      status: 'error',
    }
  }
}
