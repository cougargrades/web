
import { is } from '@cougargrades/utils/zod'
import { trimStart } from 'lodash-es'
import { DocumentReference } from './DocumentReference';
import { GetTotalEnrolled, Section } from './Section';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Enrollment } from './Enrollment';

export function ToQueryKeys(input: DocumentReference | Course | Instructor | Section): string[] {
  // DocumentReferences already have paths defined
  if (is(input, DocumentReference)) {
    // Prevent: `/foo/bar` => ['', 'foo', 'bar']
    // We want: `/foo/bar` => ['foo', 'bar']
    return trimStart(input.pathname, '/').split('/');
  }
  // Courses
  else if (is(input, Course)) {
    return trimStart(input._path, '/').split('/');
  }
  // Instructors
  else if (is(input, Instructor)) {
    return trimStart(input._path, '/').split('/');
  }
  // Sections
  else if (is(input, Section)) {
    return trimStart(input._path, '/').split('/');
  }
  // Shouldn't happen
  else {
    return []
  }
}

/**
 * May return `-1` if there were zero "occupied" sections
 * @param enrollment 
 * @param allSections 
 * @returns 
 */
export const EstimateClassSize = (enrollment: Enrollment, allSections: Section[]) => {
  const numOccupiedSections = allSections.filter(sec => GetTotalEnrolled(sec) > 0).length;
  const classSize = numOccupiedSections === 0 ? -1 : enrollment.totalEnrolled / numOccupiedSections
  return classSize
}

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0)

export const average = (x: number[]) => sum(x) / x.length;


