import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish';
import { CourseResult, InstructorResult } from './dto';
import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'

export function metaCourseDescription({ meta }: Partial<Pick<CourseResult, 'meta'>>): string {
  const { _id: staticCourseName, description, longDescription } = meta ?? {}
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

export function metaInstructorDescription({ meta, topCourses }: Partial<Pick<InstructorResult, 'meta' | 'topCourses'>>): string {
  const { _id, fullName, descriptionDepartmentsInvolved } = meta ?? {}

  const LIMIT = 3;
  // Common courses include: COSC 1234, MATH 1234, and BEEP 1234.
  const COURSES_TEXT = (
    !isNullish(topCourses) && topCourses.length > 0
    ? (
      'Common courses include: ' +
      toOxfordComma([
        ...(
          topCourses
          .map(doc => doc.courseName)
          .slice(0, LIMIT)
        ),
        ...(
          topCourses.length > LIMIT
          ? [`${topCourses.length - LIMIT} ${pluralize({ quantity: topCourses.length - LIMIT, rootWord: 'other'})}`]
          : []
        )
      ]) + '. '
    )
    : ''
  );
  return (
    isNullishOrWhitespace(fullName) 
    ? `An instructor at the University of Houston. View grade distribution data at CougarGrades.io.` 
    : `${fullName} is ${isNullishOrWhitespace(descriptionDepartmentsInvolved) || isVowel(descriptionDepartmentsInvolved) ? 'an ' : 'a ' }${`${descriptionDepartmentsInvolved} `}instructor at the University of Houston. ${COURSES_TEXT}View grade distribution data at CougarGrades.io.`
  )
}

export const isVowel = (char: string) => ['a','e','i','o','u'].includes(char.toLowerCase().substring(0,1));

/**
 * From: https://gist.github.com/JamieMason/c1a089f6f1f147dbe9f82cb3e25cd12e
 * @param array 
 * @returns 
 */
export const toOxfordComma = (array: string[]) =>
  array.length === 2
    ? array.join(' and ')
    : array.length > 2
    ? array
        .slice(0, array.length - 1)
        .concat(`and ${array.slice(-1)}`)
        .join(', ')
    : array.join(', ');

// see: https://www.grammarly.com/blog/plural-nouns/
export const pluralize = ({ quantity, rootWord }: { quantity: number, rootWord: string }) => quantity === 1 ? rootWord : ['s', 'ss', 'sh', 'ch', 'x', 'z'].some(suffix => rootWord.endsWith(suffix)) ? `${rootWord}es` : `${rootWord}s`


export function metaFakeGroupDescription(identifier: string, makeLongVersion: boolean = false): string {
  const college = curated_colleges
      .filter(college => !['college-exploratory'].includes(college.identifier))
      .find(college => college.identifier === identifier);
  if (college) {
    const NAME_STARTS_WITH_THE = college.groupLongTitle.toLowerCase().trim().startsWith('the');
    const LIMIT = 3;  
    const SUBJECT_TEXT = toOxfordComma([
      ...(
        college.subjects
        .map(subj => subj in abbreviationMap 
          ? `${abbreviationMap[subj as keyof typeof abbreviationMap]} (${subj})`
          : `"${subj}"`)
        //.sort() // TODO: sort by enrollment counts, once this has been added: https://github.com/cougargrades/publicdata/issues/30
        .slice(0, LIMIT)
      ),
      ...(
        college.subjects.length > LIMIT
        ? [`${college.subjects.length - LIMIT} ${pluralize({ quantity: college.subjects.length - LIMIT, rootWord: 'other'})}`]
        : []
      )
    ]);
    const SUFFIX = makeLongVersion ? ` Includes ${college.subjects.length} Subjects: ${SUBJECT_TEXT}.` : ''
    return `Every Subject available in ${NAME_STARTS_WITH_THE ? college.groupLongTitle : `the ${college.groupLongTitle}`}.${SUFFIX}`
  }
  else {
    // Generic description
    return 'A Group of Courses. View grade distribution data at CougarGrades.io.'
  }
}
