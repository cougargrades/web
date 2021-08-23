import { useEffect, useState } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { Course, Enrollment, Group, Instructor, PublicationInfo, Section, Util } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { Observable } from './Observable'
import { SearchResultBadge } from './useSearchResults'
import { getGradeForGPA, getGradeForStdDev, Grade, grade2Color } from '../../components/badge'
import { Column, defaultComparator } from '../../components/datatable'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { getChartData } from './getChartData'
import { EnrollmentInfoResult } from '../../components/enrollment'
import { getBadges } from './getBadges'

export type SectionPlus = Section & { id: string };

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
  },
  dataChart: {
    data: any[],
    options: { [key: string ]: any }
  },
  enrollment: EnrollmentInfoResult[];
  instructorCount: number;
  sectionCount: number;
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
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: `${data.name} (${data.identifier})`,
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
      return entries.map(e => abbreviationMap[e[0]]).filter(e => e !== undefined).join(', ')
    }
  }
  return '';
}

/**
 * React hook for accessing the course data client-side
 * @param courseName 
 * @returns 
 */
export function useCourseData(courseName: string): Observable<CourseResult> {
  const stone = useRosetta()
  const db = useFirestore()
  const { data, error, status } = useFirestoreDocData<Course>(db.doc(`/catalog/${courseName}`))
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const isBadObject = typeof data === 'object' && Object.keys(data).length === 1
  const isActualError = typeof courseName === 'string' && courseName !== '' && status !== 'loading' && isBadObject
  const [instructorData, setInstructorData] = useState<Instructor[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [sectionData, setSectionData] = useState<Section[]>([]);
  const sharedStatus = status === 'success' ? isActualError ? 'error' : isBadObject ? 'loading' : didLoadCorrectly ? 'success' : 'error' : status

  // Remove previously stored instructors whenever we reroute
  useEffect(() => {
    setInstructorData([]);
    setGroupData([]);
    setSectionData([]);
  }, [courseName])

  // Resolve the group data document references
  useEffect(() => {
    const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.groups) && Util.isDocumentReferenceArray(data.groups)) {
          setGroupData(await Util.populate<Group>(data.groups))
        }
      })();
    }
  }, [data, status])

  // Resolve the instructor document references
  useEffect(() => {
    const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.instructors) && Util.isDocumentReferenceArray(data.instructors)) {
          setInstructorData(await Util.populate<Instructor>(data.instructors))
        }
      })();
    }
  }, [data, status])

  // Resolve the section document references
  useEffect(() => {
    const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1;
    if(didLoadCorrectly) {
      (async () => {
        if(Array.isArray(data.sections) && Util.isDocumentReferenceArray(data.sections)) {
          setSectionData(await Util.populate<Section>(data.sections))
        }
      })();
    }
  }, [data, status])

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
          )) : [])
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
              field: 'instructorNames',
              headerName: 'Instructor',
              type: 'string',
              width: 95,
              sortComparator: (a, b) => defaultComparator(`${a[0].lastName}, ${a[0].firstName}`, `${b[0].lastName}, ${b[0].firstName}`),
              valueFormatter: value => `${value[0].lastName}, ${value[0].firstName}`,
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
            },
          ],
          rows: [
            ...(didLoadCorrectly ? sectionData.sort((a,b) => b.term - a.term).map(e => ({
              id: e._id,
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
              }
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
          ...(didLoadCorrectly ? ['totalA','totalB','totalC','totalD','totalF','totalS','totalNCR','totalW']
            .map(k => ({
              key: k,
              title: k.substring(5), // 'totalA' => 'A'
              color: grade2Color.get(k.substring(5) as Grade),
              value: data.enrollment[k],
              percentage: data.enrollment[k] !== undefined && data.enrollment[k].totalEnrolled !== 0 ? data.enrollment[k] / data.enrollment.totalEnrolled * 100 : 0,
            })
          ) : []),
        ],
        instructorCount: didLoadCorrectly ? instructorData.length : 0,
        sectionCount: didLoadCorrectly ? sectionData.length : 0,
      },
      error,
      status: sharedStatus,
    }
  }
  catch(error) {
    return {
      data: undefined,
      error,
      status: 'error',
    }
  }
}
