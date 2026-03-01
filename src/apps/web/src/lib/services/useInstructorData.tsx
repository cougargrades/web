import { Link } from '@tanstack/react-router'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { CourseService, InstructorService } from '@cougargrades/services'
import { formatTermCode } from '@cougargrades/models';
import { formatDropRateValue, formatGPAValue, formatSDValue, getGradeForGPA, getGradeForStdDev, grade2Color, type CoursePlus, type CourseResult, type InstructorResult, type SectionPlus } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import type { Column } from '../../components/datatable';
import { GPAValueWithWarning } from '../../components/GPAValueWithWarning';
import { Badge } from '../../components/badge';

export interface ClientInstructorResult extends InstructorResult {
  sectionDataGrid: {
    columns: Column<SectionPlus>[];
    rows: SectionPlus[];
  },
  courseDataGrid: {
    columns: Column<CoursePlus>[];
    rows: CoursePlus[];
  }
}

export function instructorDataQueryOptions(instructorName: string) {
  return queryOptions({
    queryKey: ['instructor', instructorName.toLowerCase()],
    queryFn: async () => {
      const svc = new InstructorService();
      return await svc.GetInstructor(instructorName);
    },
    select: (data): ClientInstructorResult | null => (
      isNullish(data)
      ? null
      : {
        ...data,
        sectionDataGrid: {
          columns: [
            {
              field: 'term',
              headerName: 'Term',
              type: 'number',
              width: 65,
              valueFormatter: value => formatTermCode(value),
            },
            {
              field: 'courseName',
              headerName: 'Course',
              type: 'string',
              width: 75,
              padding: 8,
              valueFormatter: value => <Link to="/c/$courseName" params={{ courseName: value }}>{value}</Link>,
            },
            {
              field: 'sectionNumber',
              headerName: 'Section',
              description: 'Section Number',
              type: 'number',
              width: 75,
            },
            //@ts-ignore
            {
              field: 'totalEnrolled',
              headerName: '# Enrolled',
              description: `Total number of students who have been enrolled in this section`,
              type: 'number',
              width: 90,
            },
            //@ts-ignore
            ...(['A','B','C','D','F','W','S','NCR']).map<Column<SectionPlus>>(e => ({
              field: e as any,
              headerName: e,
              description: `Number of ${e}s given for this section`,
              type: 'number',
              width: e !== 'NCR' ? 30 : 60,
              padding: 6,
            })),
            // TODO: "Total Enrolled"
            //@ts-ignore
            {
              field: 'semesterGPA',
              headerName: 'GPA',
              description: 'Grade Point Average for just this section',
              type: 'number',
              width: 60,
              padding: 8,
              valueFormatter: (value, row) => <GPAValueWithWarning value={value} row={row} />
            },
          ],
          rows: [...data?.sectionDataGrid.rows ?? []],
        },
        courseDataGrid: {
          columns: [
            {
              field: 'id',
              headerName: 'Name',
              type: 'string',
              width: 65,
              padding: 8,
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
              width: 80,
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
              valueFormatter: value => (
                value !== 0
                ? <Badge style={{ backgroundColor: grade2Color[getGradeForGPA(value)] }}>{formatGPAValue(value)}</Badge>
                : ''
              ),
            },
            {
              field: 'standardDeviation',
              headerName: 'SD',
              description: 'Standard deviation of GPA across all sections in a course',
              type: 'number',
              width: 60,
              padding: 8,
              valueFormatter: value => (
                value !== 0
                ? <Badge style={{ backgroundColor: grade2Color[getGradeForStdDev(value)] }}>{formatSDValue(value)}</Badge>
                : ''
              ),
            },
            //@ts-ignore
            {
              field: 'dropRate',
              headerName: '% W',
              description: 'Drop rate, # of total Ws ÷ # of total enrolled',
              type: 'number',
              width: 60,
              padding: 8,
              valueFormatter: value => (
                isNullish(value) || isNaN(value)
                ? 'No data'
                : <Badge style={{ backgroundColor: grade2Color['W'] }}>{formatDropRateValue(value)}</Badge>
              ),
            },
          ],
          rows: [...data?.courseDataGrid.rows ?? []],
        }
      }
    )
  })
}

export function useInstructorData(instructorName: string) {
  const options = instructorDataQueryOptions(instructorName);
  const query = useQuery(options);
  return query;
}
