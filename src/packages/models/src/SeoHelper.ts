import { isNullishOrWhitespace } from '@cougargrades/utils/nullish';
import { CourseResult } from './dto';

export function metaCourseDescription({ _id: staticCourseName, description, longDescription }: Partial<Pick<CourseResult, '_id' | 'description' | 'longDescription'>>): string {
  return (
    isNullishOrWhitespace(staticCourseName)
    ? `A course at the University of Houston. View grade distribution data at CougarGrades.io.`
    : (
      isNullishOrWhitespace(longDescription)
      ? `${staticCourseName} (${description}) is a course at the University of Houston. View grade distribution data at CougarGrades.io.`
      : `View grade distribution data for ${staticCourseName} (${description}). ${longDescription}`
    )
  )
}
