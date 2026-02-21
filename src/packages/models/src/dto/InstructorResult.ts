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


export type InstructorResult = z.infer<typeof InstructorResult>
export const InstructorResult = z.object({
  badges: SearchResultBadge.array(),
  enrollment: EnrollmentInfoResult.array(),
  firstTaught: z.string(),
  lastTaught: z.string(),
  relatedGroups: LiteGroupResult.array(),
  relatedCourses: CourseInstructorResult.array(),
  sectionDataGrid: {
    /**
     * These can't be used on the back-end because functions can't be serialized.
     * Therefore, they aren't part of the shared model.
     */
    // columns: Column<SectionPlus>[];
    rows: SectionPlus.array(),
  },
  courseDataGrid: {
    /**
     * These can't be used on the back-end because functions can't be serialized.
     * Therefore, they aren't part of the shared model.
     */
    // columns: Column<SectionPlus>[];
    rows: CoursePlus.array(),
  },
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
});

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
      const try_attempt = () => entries
        .slice(0, numAllowedEntries)
        .map(kvp => kvp[0])
        // TODO: use the abbreviation again later
        .map(abbr => (abbreviationMap as Record<string, string | undefined>)[abbr] ?? abbr)
        .filter(desc => desc !== undefined)
        .join(', ');
      while(try_attempt().length > CHARACTER_LIMIT) {
        numAllowedEntries--;
      }
      
      return try_attempt();
    }
  }
  return '';
}
