import { z } from 'zod'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { getBadges, SearchResultBadge } from './Badges';
import { EnrollmentInfoResult } from './EnrollmentInfoResult';
import { SeasonalAvailability } from './SeasonalAvailability';
import { SparklineData } from '../SparklineData';
import { LiteGroupResult } from './GroupResult';
import { CoursePlus, SectionPlus } from './Plus';
import { CourseInstructorResult } from './CourseInstructorResult';
import { Instructor } from '../Instructor';

export type InstructorTopCourseEntry = z.infer<typeof InstructorTopCourseEntry>
export const InstructorTopCourseEntry = z.object({
  courseName: z.string(),
  totalEnrolled: z.number(),
})

export type InstructorResult = z.infer<typeof InstructorResult>
export const InstructorResult = z.object({
  meta: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    fullNameLastNameFirst: z.string(),
    /**
     * Ex: 'Mathematics, Computer Science'
     * Output of `generateSubjectString(...)`
     */
    descriptionDepartmentsInvolved: z.string(),
  }),
  badges: SearchResultBadge.array(),
  enrollment: EnrollmentInfoResult.array(),
  firstTaught: z.string(),
  lastTaught: z.string(),
  relatedGroups: LiteGroupResult.array(),
  relatedCourses: CourseInstructorResult.array(),
  sectionDataGrid: z.object({
    /**
     * These can't be used on the back-end because functions can't be serialized.
     * Therefore, they aren't part of the shared model.
     */
    // columns: Column<SectionPlus>[];
    rows: SectionPlus.array(),
  }),
  courseDataGrid: z.object({
    /**
     * These can't be used on the back-end because functions can't be serialized.
     * Therefore, they aren't part of the shared model.
     */
    // columns: Column<SectionPlus>[];
    rows: CoursePlus.array(),
  }),
  dataChart: z.object({
    data: z.array(z.any()),
    options: z.record(z.string(), z.any()),
  }),
  courseCount: z.number(),
  sectionCount: z.number(),
  classSize: z.number(),
  sectionLoadingProgress: z.number(),
  rmpHref: z.string().optional(),
  seasonalAvailability: SeasonalAvailability,
  enrollmentSparklineData: SparklineData.optional(),
  /**
   * The top courses that *this instructor* taught, counting by the number enrolled in sections *they taught*.
   * (should be pre-sorted in descending order)
   */
  topCourses: InstructorTopCourseEntry.array(),
});

export function instructor2Result(data: Instructor): CourseInstructorResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    title: data.fullName,
    altTitle: `${data.lastName}, ${data.firstName}`,
    subtitle: generateSubjectStringByCharacterLimit(data),
    caption: `${Array.isArray(data.courses) ? data.courses.length : 0} courses • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    lastInitial: data.lastName.charAt(0).toUpperCase()
  };
}

export function generateSubjectStringByCharacterLimit(data: Instructor | undefined, characterLimit: number = 70): string {
  if(data !== undefined && data !== null && data.departments !== undefined && data.departments !== null) {
    const entries = Object.entries(data.departments).sort((a, b) => b[1] - a[1])
    if(entries.length > 0) {
      // The following attempts to prevent Instructor descriptions from being too long
      let numAllowedEntries = entries.length
      const try_attempt = () => entries
        .slice(0, numAllowedEntries)
        .map(kvp => kvp[0])
        // TODO: use the abbreviation again later
        .map(abbr => (abbreviationMap as Record<string, string | undefined>)[abbr] ?? abbr)
        .filter(desc => desc !== undefined)
        .join(', ');
      while(try_attempt().length > characterLimit) {
        numAllowedEntries--;
      }
      
      return try_attempt();
    }
  }
  return '';
}

export function generateSubjectStringByEntryLimit(data: Instructor | undefined, entries: number = 3) {
  // sort department entries in descending by value
  if(data !== undefined) {
    const depts: [keyof typeof abbreviationMap, number][] = Object.entries(data.departments) as any;

    const text = depts // [string, number][]
      .sort((a, b) => b[1] - a[1]) // sort
      .slice(0, entries) // limit to 3 entries
      .map(e => abbreviationMap[e[0]]) // ['MATH'] => ['Mathematics']
      .filter(e => e !== undefined) // remove those that didn't have an abbreviation
      .join(', '); // 'Mathematics, Computer Science'
    return text;
  }
  return ''
}
