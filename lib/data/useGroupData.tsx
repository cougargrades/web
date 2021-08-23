import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePrevious } from 'react-use'
import { Course, Util } from '@cougargrades/types'
import { Observable } from './Observable'
import { GroupResult, course2Result,  } from './useAllGroups'
import { CourseInstructorResult } from './useCourseData'
import { Column, defaultComparator } from '../../components/datatable'
import { Badge, getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { formatDropRateValue, formatGPAValue, formatSDValue } from './getBadges'


export type CoursePlus = Course & {
  id: string,
  instructorCount: number,
  sectionCount: number,
  gradePointAverage: number,
  standardDeviation: number,
  dropRate: number,
  totalEnrolled: number,
  enrolledPerSection: number,
};

export interface GroupDataResult {
  topEnrolled: CourseInstructorResult[];
  dataGrid: {
    columns: Column<CoursePlus>[];
    rows: CoursePlus[];
  },
}

export function useGroupData(data: GroupResult): Observable<GroupDataResult> {
  const stone = useRosetta()
  const [courseData, setCourseData] = useState<Course[]>([]);
  const previous = usePrevious(data.key)

  useEffect(() => {
    // prevent loading the same data again
    if(previous !== data.key) {
      setCourseData([]);
      (async () => {
        if(Array.isArray(data.courses) && Util.isDocumentReferenceArray(data.courses)) {
          setCourseData(
            (await Util.populate<Course>(data.courses))
              // filter out undefined because there might be some empty references
              .filter(e => e !== undefined)
              // sort courses by total enrolled
              .sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled)
            ) 
        }
      })();
    }
    
  }, [data,previous])

  try {
    return {
      data: {
        topEnrolled: [
          ...courseData.map(e => course2Result(e))
        ],
        dataGrid: {
          columns: [
            {
              field: 'id',
              headerName: 'Name',
              type: 'string',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => <Link href={`/c/${encodeURI(value)}`}><a>{value}</a></Link>,
            },
            {
              field: 'description',
              headerName: 'Description',
              type: 'string',
              width: 95,
              padding: 8,
            },
            {
              field: 'firstTaught',
              headerName: 'First Taught',
              description: 'The oldest semester that this course was taught',
              type: 'number',
              width: 65,
              padding: 6,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'lastTaught',
              headerName: 'Last Taught',
              description: 'The most recent semester that this course was taught',
              type: 'number',
              width: 65,
              padding: 6,
              valueFormatter: value => `${stone.t(`season.${seasonCode(value)}`)} ${getYear(value)}`,
            },
            {
              field: 'instructorCount',
              headerName: '# Instructors',
              description: 'Number of instructors',
              type: 'number',
              width: 100,
              padding: 4,
              valueFormatter: value => value.toLocaleString(),
            },
            {
              field: 'sectionCount',
              headerName: '# Sections',
              description: 'Number of sections',
              type: 'number',
              width: 90,
              padding: 8,
              valueFormatter: value => value.toLocaleString(),
            },
            {
              field: 'totalEnrolled',
              headerName: '# Enrolled',
              description: 'Total number of students who have been enrolled in this course',
              type: 'number',
              width: 85,
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
              valueFormatter: value => <Badge style={{ backgroundColor: grade2Color.get(getGradeForGPA(value)) }}>{formatGPAValue(value)}</Badge>,
            },
            {
              field: 'standardDeviation',
              headerName: 'SD',
              description: 'Standard deviation of GPA across all sections in a course',
              type: 'number',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => <Badge style={{ backgroundColor: grade2Color.get(getGradeForStdDev(value)) }}>{formatSDValue(value)}</Badge>,
            },
            {
              field: 'dropRate',
              headerName: '% W',
              description: 'Drop rate, # of total Ws ÷ # of total enrolled',
              type: 'number',
              width: 60,
              padding: 8,
              // eslint-disable-next-line react/display-name
              valueFormatter: value => isNaN(value) ? 'No data' : <Badge style={{ backgroundColor: grade2Color.get('W') }}>{formatDropRateValue(value)}</Badge>,
            },
          ],
          rows: [
            ...(courseData.sort((a,b) => b._id.localeCompare(a._id)).map(e => ({
              id: e._id,
              instructorCount: Array.isArray(e.instructors) ? e.instructors.length : 0,
              sectionCount: Array.isArray(e.sections) ? e.sections.length : 0,
              gradePointAverage: e.GPA.average,
              standardDeviation: e.GPA.standardDeviation,
              dropRate: e.enrollment !== undefined ? (e.enrollment.totalW/e.enrollment.totalEnrolled*100) : NaN,
              totalEnrolled: e.enrollment !== undefined ? e.enrollment.totalEnrolled : NaN,
              enrolledPerSection: e.enrollment !== undefined && Array.isArray(e.sections) ? (e.enrollment.totalEnrolled / e.sections.length) : NaN,
              ...e,
            })))
          ],
          //rows: [],
        },
      },
      error: undefined,
      status: courseData.length === 0 ? 'loading' : 'success',
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
