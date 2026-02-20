
import { z } from 'zod'
import { Course, CourseThin, PublicationInfo, TCCNSUpdateInfo } from '../Course'
import { Instructor, InstructorThin } from '../Instructor'
import { getBadges, SearchResultBadge } from './Badges'
import { Group } from '../Group'
import { SparklineData } from '../SparklineData'
import { SeasonalAvailability } from './SeasonalAvailability'
import { EnrollmentInfoResult } from './EnrollmentInfoResult'

// export type TopMetric = z.infer<typeof TopMetric>
// export const TopMetric = z.enum(['totalEnrolled'])

export type CourseGroupResult = z.infer<typeof CourseGroupResult>
export const CourseGroupResult = z.object({
  key: z.string(),
  href: z.string(),
  title: z.string(),
  description: z.string(),
  count: z.number(),
})

export type CourseInstructorResult = z.infer<typeof CourseInstructorResult>
export const CourseInstructorResult = z.object({
  key: z.string(),              // used for react, same as document path
  href: z.string(),             // where to redirect the user when selected
  title: z.string(),            // typically the instructor's full name
  altTitle: z.string().optional(), // last‑name‑first fullname
  subtitle: z.string(),         // instructor’s departments
  caption: z.string(),          // “4 courses • 5 sections”
  badges: SearchResultBadge.array(),
  id: z.string(),
  lastInitial: z.string(),
})

export type CourseResult = z.infer<typeof CourseResult>
export const CourseResult = z.object({
  badges: SearchResultBadge.array(),
  publications: z.array(
    z.intersection(
      PublicationInfo,
      z.object({ key: z.string() })
    )
  ),
  firstTaught: z.string(),
  lastTaught: z.string(),
  relatedGroups: CourseGroupResult.array(),
  relatedInstructors: CourseInstructorResult.array(),
  // dataGrid: {
  //   columns: Column<SectionPlus>[];
  //   rows: SectionPlus[];
  // };
  dataChart: z.object({
    data: z.array(z.any()),
    options: z.record(z.string(), z.any()),
  }),
  enrollment: EnrollmentInfoResult.array(),
  instructorCount: z.number(),
  sectionCount: z.number(),
  classSize: z.number(),
  sectionLoadingProgress: z.number(),
  tccnsUpdates: TCCNSUpdateInfo.array(),
  enrollmentSparklineData: SparklineData.optional(),
  seasonalAvailability: SeasonalAvailability,
});

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
