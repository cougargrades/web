import React from 'react'
import Link from 'next/link'
import useSWR from 'swr/immutable'
import { Course, Enrollment, Group, Instructor, Section, Util } from '@cougargrades/types'
import { Observable, ObservableStatus } from './Observable'
import { SearchResultBadge } from './useSearchResults'
import { Badge, getGradeForGPA, getGradeForStdDev, Grade, grade2Color } from '../../components/badge'
import { Column, defaultComparator } from '../../components/datatable'
import { getRosetta, useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { EnrollmentInfoResult } from '../../components/enrollment'
import { formatDropRateValue, formatGPAValue, formatSDValue, getBadges } from './getBadges'
import { CourseGroupResult, CourseInstructorResult, group2Result, SectionPlus } from './useCourseData'
import { course2Result } from './useAllGroups'
import { CoursePlus } from './useGroupData'
import { getChartDataForInstructor } from './getChartDataForInstructor'
//import { firebaseApp, getFirestoreDocument } from '../ssg'


export interface InstructorResult {
  badges: SearchResultBadge[];
  enrollment: EnrollmentInfoResult[];
  firstTaught: string;
  lastTaught: string;
  relatedGroups: CourseGroupResult[];
  relatedCourses: CourseInstructorResult[];
  sectionDataGrid: {
    columns: Column<SectionPlus>[];
    rows: SectionPlus[];
  };
  courseDataGrid: {
    columns: Column<CoursePlus>[];
    rows: CoursePlus[];
  };
  dataChart: {
    data: any[],
    options: { [key: string ]: any }
  };
  courseCount: number;
  sectionCount: number;
  classSize: number;
  sectionLoadingProgress: number;
  rmpHref?: string;
}

/**
 * Necessary for including `valueFormatter` in table results
 * Used client-side
 */
export function useInstructorData(instructorName: string): Observable<InstructorResult> {
  const stone = useRosetta()

  const { data, error, isLoading } = useSWR<InstructorResult>(`/api/instructor/${instructorName}`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data || !instructorName) ? 'loading' : 'success'

  try {
    return {
      data: {
        ...(status === 'success' ? data : {} as any),
        sectionDataGrid: {
          columns: [
            {
              field: 'term',
              headerName: 'Term',
              type: 'number',
              width: 65,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'courseName',
              headerName: 'Course',
              type: 'string',
              width: 75,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => <Link href={`/c/${encodeURI(value)}`}><a>{value}</a></Link>,
            },
            {
              field: 'sectionNumber',
              headerName: 'Section #',
              type: 'number',
              width: 90,
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
            ...(status === 'success' ? data!.sectionDataGrid.rows : []),
          ],
        },
        courseDataGrid: {
          columns: [
            {
              field: 'id',
              headerName: 'Name',
              type: 'string',
              width: 65,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => <Link href={`/c/${encodeURI(value)}`}><a>{value}</a></Link>,
            },
            {
              field: 'description',
              headerName: 'Description',
              type: 'string',
              width: 105,
              padding: 8,
            },
            {
              field: 'firstTaught',
              headerName: 'First Taught',
              description: 'The oldest semester that this course was taught',
              type: 'number',
              width: 75,
              padding: 6,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'lastTaught',
              headerName: 'Last Taught',
              description: 'The most recent semester that this course was taught',
              type: 'number',
              width: 75,
              padding: 6,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'instructorCount',
              headerName: '# Instructors',
              description: 'Number of instructors',
              type: 'number',
              width: 110,
              padding: 4,
              valueFormatter: value => value.toLocaleString(),
            },
            {
              field: 'sectionCount',
              headerName: '# Sections',
              description: 'Number of sections',
              type: 'number',
              width: 95,
              padding: 8,
              valueFormatter: value => value.toLocaleString(),
            },
            {
              field: 'totalEnrolled',
              headerName: '# Enrolled',
              description: 'Total number of students who have been enrolled in this course',
              type: 'number',
              width: 95,
              padding: 8,
              valueFormatter: value => isNaN(value) ? 'No data' : value.toLocaleString(),
            },
            {
              field: 'enrolledPerSection',
              headerName: 'Class Size',
              description: 'Estimated average size of each section, # of total enrolled ÷ # of sections',
              type: 'number',
              width: 80,
              padding: 6,
              valueFormatter: value => isNaN(value) ? 'No data' : `~ ${value.toFixed(1)}`,
            },
            {
              field: 'gradePointAverage',
              headerName: 'GPA',
              description: 'Average of Grade Point Average',
              type: 'number',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => value !== 0 ? <Badge style={{ backgroundColor: grade2Color[getGradeForGPA(value)] }}>{formatGPAValue(value)}</Badge> : '',
            },
            {
              field: 'standardDeviation',
              headerName: 'SD',
              description: 'Standard deviation of GPA across all sections in a course',
              type: 'number',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => value !== 0 ? <Badge style={{ backgroundColor: grade2Color[getGradeForStdDev(value)] }}>{formatSDValue(value)}</Badge> : '',
            },
            {
              field: 'dropRate',
              headerName: '% W',
              description: 'Drop rate, # of total Ws ÷ # of total enrolled',
              type: 'number',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => isNaN(parseFloat(`${value}`)) ? 'No data' : <Badge style={{ backgroundColor: grade2Color['W'] }}>{formatDropRateValue(value)}</Badge>,
            },
          ],
          rows: [
            ...(status === 'success' ? data!.courseDataGrid.rows : []),
          ],
        },
      },
      error,
      status,
    }
  }
  catch(error) {
    return {
      data: undefined,
      error: error as any,
      status: 'error',
    }
  }
}
