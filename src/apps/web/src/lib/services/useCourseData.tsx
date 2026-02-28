import { Link } from '@tanstack/react-router'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { CourseService } from '@cougargrades/services'
import { formatTermCode } from '@cougargrades/models';
import type { CourseResult, SectionPlus } from '@cougargrades/models/dto';
import { isNullish } from '@cougargrades/utils/nullish';
import type { Column } from '../../components/datatable';
import { GPAValueWithWarning } from '../../components/GPAValueWithWarning';

export interface ClientCourseResult extends CourseResult {
  dataGrid: {
    columns: Column<SectionPlus>[];
    rows: SectionPlus[];
  },
}

export function courseDataQueryOptions(courseName: string) {
  return queryOptions({
    queryKey: ['course', courseName],
    queryFn: async () => {
      const svc = new CourseService();
      return await svc.GetCourse(courseName)
    },
    select: (data): ClientCourseResult | null => (
      isNullish(data)
      ? null
      : {
        ...data,
        dataGrid: {
          columns: [
            {
              field: 'term',
              headerName: 'Term',
              type: 'number',
              width: 65,
              valueFormatter: (value: number) => formatTermCode(value),
            },
            {
              field: 'sectionNumber',
              headerName: 'Section',
              type: 'number',
              width: 75,
            },
            {
              field: 'primaryInstructorName',
              headerName: 'Instructor',
              type: 'string',
              width: 95,
              valueFormatter: (value: any) => (
                <Link to="/i/$instructorName" params={{ instructorName: encodeURI(value) }}>
                  {value}
                </Link>
              ),
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
            //@ts-ignore
            {
              field: 'semesterGPA',
              headerName: 'GPA',
              description: 'Grade Point Average for just this section',
              type: 'number',
              width: 60,
              padding: 8,
              valueFormatter: (value: number | null, row: SectionPlus) => <GPAValueWithWarning value={value} row={row} />
            },
          ],
          rows: [...data?.dataGrid.rows ?? []]
        },
      }
    )
  })
}

export function useCourseData(courseName: string) {
  const options = courseDataQueryOptions(courseName);
  const query = useQuery(options);
  return query;
}
