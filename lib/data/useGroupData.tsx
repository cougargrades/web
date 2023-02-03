import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr/immutable'
import { Course } from '@cougargrades/types'
import { Observable, ObservableStatus } from './Observable'
import { course2Result, PopulatedGroupResult,  } from './useAllGroups'
import { CourseInstructorResult } from './useCourseData'
import { Column, defaultComparator } from '../../components/datatable'
import { Badge, getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { formatDropRateValue, formatGPAValue, formatSDValue } from './getBadges'
import { getChartDataForInstructor } from './getChartDataForInstructor'
import { ENABLE_GROUP_SECTIONS } from '../../components/groupcontent'


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
  };
  dataChart: {
    data: any[],
    options: { [key: string ]: any }
  };
  sectionLoadingProgress: number;
}

/**
 * Necessary for remapping data into client-usable nodes
 * @param data 
 * @returns 
 */
export function useGroupData(data: PopulatedGroupResult): Observable<GroupDataResult> {
  const stone = useRosetta()
  const { data: oneGroupData, error, isLoading } = useSWR<PopulatedGroupResult>(`/api/group/${data.key}${ENABLE_GROUP_SECTIONS ? '/sections' : ''}`)
  const sectionStatus: ObservableStatus = error ? 'error' : (isLoading || !oneGroupData || !data.key) ? 'loading' : 'success'
  const sectionData = sectionStatus === 'success' ? oneGroupData!.sections : []
  const [sectionLoadingProgress, setSectionLoadingProgress] = useState<number>(0);

  try {
    return {
      data: {
        topEnrolled: [
          ...data.courses.sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled).map(e => course2Result(e))
        ],
        dataGrid: {
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
              valueFormatter: value => isNaN(value) ? 'No data' : <Badge style={{ backgroundColor: grade2Color['W'] }}>{formatDropRateValue(value)}</Badge>,
            },
          ],
          rows: [
            ...(data.courses.sort((a,b) => b._id.localeCompare(a._id)).map(e => ({
              ...e,
              id: e._id,
              //instructorCount: Array.isArray(e.instructors) ? e.instructors.length : 0,
              instructorCount: e.instructorCount ?? 0,
              //sectionCount: Array.isArray(e.sections) ? e.sections.length : 0,
              sectionCount: e.sectionCount ?? 0,
              gradePointAverage: e.GPA.average,
              standardDeviation: e.GPA.standardDeviation,
              dropRate: e.enrollment !== undefined ? (e.enrollment.totalW/e.enrollment.totalEnrolled*100) : NaN,
              totalEnrolled: e.enrollment !== undefined ? e.enrollment.totalEnrolled : NaN,
              //enrolledPerSection: e.enrollment !== undefined && Array.isArray(e.sections) ? (e.enrollment.totalEnrolled / e.sections.length) : NaN,
              enrolledPerSection: e.enrollment !== undefined && e.sectionCount !== undefined ? (e.enrollment.totalEnrolled / e.sectionCount) : NaN,
            })))
          ],
          //rows: [],
        },
        dataChart: {
          data: [
            ...getChartDataForInstructor(sectionData)
          ],
          // https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en#configuration-options
          options: {
            title: `${data.title} Average GPA Over Time by Course`,
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
        //sectionLoadingProgress: (sectionLoadingProgress/data.sections.length*100),
        sectionLoadingProgress,
      },
      error: undefined,
      status: sectionStatus,
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
