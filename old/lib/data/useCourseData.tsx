import React from 'react'
import Link from 'next/link'
import useSWR from 'swr/immutable'
import { Group, Instructor, PublicationInfo, TCCNSUpdateInfo, Section, SparklineData } from '@cougargrades/types'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { Observable, ObservableStatus } from './Observable'
import { SearchResultBadge } from './useSearchResults'
import { Column } from '../../components/datatable'
import { useRosetta } from '../i18n'
import { getYear, seasonCode } from '../util'
import { EnrollmentInfoResult } from '../../components/enrollment'
import { getBadges } from './getBadges'
import { GPAValueWithWarning } from '../../components/GPAValueWithWarning'
import { SeasonalAvailability } from './seasonableAvailability'

export type SectionPlus = Section & {
  id: string,
  primaryInstructorName: string,
  totalEnrolled?: number;
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
  enrollmentSparklineData?: SparklineData;
  seasonalAvailability: SeasonalAvailability;
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
  altTitle?: string; // this is used as a workaround to store the last-name-first fullname (ex: Beck, James Tyler)
  subtitle: string; // typically the instructor's associated departments (ex: Applied Music, Music)
  caption: string; // typically the number of courses and sections (ex: 4 courses • 5 sections)
  badges: SearchResultBadge[];
  id: string;
  lastInitial: string;
}

export function group2Result(data: Group): CourseGroupResult {
  const isCoreCurrGroup = Array.isArray(data.categories) && data.categories.includes('#UHCoreCurriculum');
  const isSubjectGroup = Array.isArray(data.categories) && data.categories.includes('#UHSubject');
  //const suffix = isCoreCurrGroup ? ' (Core)' : isSubjectGroup ? ' (Subject)' : '';
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: `${data.name}`,
    description: data.description,
    count: Array.isArray(data.courses) ? data.courses.length : 0
  };
}

export function instructor2Result(data: Instructor): CourseInstructorResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    title: data.fullName,
    altTitle: `${data.lastName}, ${data.firstName}`,
    subtitle: generateSubjectString(data),
    caption: `${Array.isArray(data.courses) ? data.courses.length : 0} courses • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    lastInitial: data.lastName.charAt(0).toUpperCase()
  };
}

export function generateSubjectString(data: Instructor | undefined): string {
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
 * React hook for accessing the course data client-side
 * @param courseName 
 * @returns 
 */
export function useCourseData(courseName: string): Observable<CourseResult> {
  const stone = useRosetta()

  const { data, error, isLoading } = useSWR<CourseResult>(`/api/course/${courseName}`)
  const status: ObservableStatus = error ? 'error' : (isLoading || !data || !courseName) ? 'loading' : 'success'

  try {
    return {
      data: {
        ...(status === 'success' ? data : {} as any),
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
              headerName: 'Section',
              type: 'number',
              width: 75,
            },
            {
              field: 'primaryInstructorName',
              headerName: 'Instructor',
              type: 'string',
              width: 95,
              valueFormatter: value => <Link href={`/i/${encodeURI(value)}`} legacyBehavior><a>{value}</a></Link>,
            },
            {
              field: 'totalEnrolled',
              headerName: '# Enrolled',
              description: `Total number of students who have been enrolled in this section`,
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
              valueFormatter: (value, row) => <GPAValueWithWarning value={value} row={row} />
            },
          ],
          rows: [
            ...(status === 'success' ? data!.dataGrid.rows : []),
          ],
        },
      },
      error,
      status,
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

