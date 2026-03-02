import { Link } from '@tanstack/react-router'
import { formatTermCode } from '@cougargrades/models';
import { course2Result, formatDropRateValue, formatGPAValue, formatSDValue, getGradeForGPA, getGradeForStdDev, grade2Color } from '@cougargrades/models/dto';
import type { CourseInstructorResult, CoursePlus, PopulatedGroupResult } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import type { Column } from '../../components/datatable';
import { useOneGroup } from './useOneGroup';
import { Badge } from '../../components/badge';


export interface GroupDataResult {
  topEnrolled: CourseInstructorResult[];
  dataGrid: {
    columns: Column<CoursePlus>[];
    rows: CoursePlus[];
  };
}

export function useGroupData(data: PopulatedGroupResult): GroupDataResult {
  
  /**
   * So this used to do async stuff... but on account of it not anymore, it doesn't?
   * The Group data system is all kinds of fucked with the "fake" groups and unclear where the data comes from.
   * 
   * Total spaghetti.
   */

  //const { data: oneGroupData, error, isPending } = useOneGroup(data.key)

  return {
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
          valueFormatter: value => <Link to="/c/$courseName" params={{ courseName: value }}>{value}</Link>,
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
          valueFormatter: value => formatTermCode(value),
        },
        {
          field: 'lastTaught',
          headerName: 'Last Taught',
          description: 'The most recent semester that this course was taught',
          type: 'number',
          width: 75,
          padding: 6,
          valueFormatter: value => formatTermCode(value),
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
          width: 85,
          padding: 6,
          valueFormatter: value => value.toLocaleString(),
        },
        //@ts-ignore
        {
          field: 'totalEnrolled',
          headerName: '# Enrolled',
          description: 'Total number of students who have been enrolled in this course',
          type: 'number',
          width: 95,
          padding: 8,
          valueFormatter: value => isNullish(value) || isNaN(value) ? 'No data' : value.toLocaleString(),
        },
        //@ts-ignore
        {
          field: 'classSize',
          headerName: 'Class Size',
          description: 'Estimated average size of each section, # of total enrolled ÷ # of sections. May include "empty" sections.',
          type: 'number',
          width: 90,
          padding: 6,
          valueFormatter: value => isNullish(value) || isNaN(value) ? 'No data' : `~ ${value.toFixed(1)}`,
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
        //@ts-ignore
        {
          field: 'dropRate',
          headerName: '% W',
          description: 'Drop rate, # of total Ws ÷ # of total enrolled',
          type: 'number',
          width: 60,
          padding: 8,
          // eslint-disable-next-line react/display-name
          valueFormatter: value => isNullish(value) || isNaN(value) ? 'No data' : <Badge style={{ backgroundColor: grade2Color['W'] }}>{formatDropRateValue(value)}</Badge>,
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
          classSize: e.enrollment !== undefined && e.sectionCount !== undefined ? (e.enrollment.totalEnrolled / e.sectionCount) : NaN,
          // TODO: We can't do the code below because we don't have access to all the sectionData at this time
          // classSize: e.enrollment !== undefined && e.sectionCount !== undefined ? estimateClassSize(e.enrollment, []) : NaN,
        })))
      ],
      //rows: [],
    },
  }
}
