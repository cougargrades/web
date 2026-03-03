
import { z } from 'zod'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { isNullishOrWhitespace } from '@cougargrades/utils/nullish'
import { Course, PublicationInfo, TCCNSUpdateInfo } from '../Course'
import { getBadges, SearchResultBadge } from './Badges'
import { SparklineData } from '../SparklineData'
import { SeasonalAvailability } from './SeasonalAvailability'
import { EnrollmentInfoResult } from './EnrollmentInfoResult'
import { CourseInstructorResult } from './CourseInstructorResult'
import { SectionPlus } from './Plus'
import { LiteGroupResult } from './GroupResult'

export type CourseTopInstructorEntry = z.infer<typeof CourseTopInstructorEntry>
export const CourseTopInstructorEntry = z.object({
  instructorName: z.string(),
  totalEnrolled: z.number(),
})

export type CourseResult = z.infer<typeof CourseResult>
export const CourseResult = z.object({
  meta: z.object({
    _id: z.string(),
    department: z.string(),
    catalogNumber: z.string(),
    description: z.string(),
    longDescription: z.string(),
  }),
  badges: SearchResultBadge.array(),
  publications: PublicationInfo.extend({
    key: z.string()
  }).array(),
  firstTaught: z.string(),
  lastTaught: z.string(),
  relatedGroups: LiteGroupResult.array(),
  relatedInstructors: CourseInstructorResult.array(),
  dataGrid: z.object({
    /**
     * These can't be used on the back-end because functions can't be serialized.
     * Therefore, they aren't part of the shared model.
     */
    // columns: Column<SectionPlus>[];
    rows: SectionPlus.array(),
  }),
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
  /**
   * The top instructors for *this course*, counting by the number enrolled in sections *they taught*.
   * (should be pre-sorted in descending order)
   */
  topInstructors: CourseTopInstructorEntry.array(),
});

export function course2Result(data: Course): CourseInstructorResult {
  const fullDepartmentName: string | undefined = (abbreviationMap as Record<string, string | undefined>)[data.department];
  return {
    key: data._path,
    href: `/c/${data._id}`,
    title: `${data.department} ${data.catalogNumber}`,
    subtitle: data.description,
    caption: `${data.instructors.length} instructors • ${data.sections.length} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    //lastInitial: '',
    lastInitial: (
      isNullishOrWhitespace(fullDepartmentName)
      ? `"${data.department}" Subject`
      : `${fullDepartmentName} (${data.department})`
    ),
  };
}

