import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
//import courseIndexData from '@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json'
import { Group, Instructor } from '@cougargrades/types'
import { isDocumentReferenceArray } from '@cougargrades/types/dist/Util'
import { isEmpty, isVowel, toOxfordComma, unwrap } from '../i18n/helper'
import { CourseProps } from '../pages/c/[courseName]'
import { InstructorProps } from '../pages/i/[instructorName]'
import { pluralize } from './i18n'
import { notNullish } from './util'

//const courseIndex = courseIndexData.data

export function metaCourseDescription({ staticCourseName, staticDescription, staticLongDescription }: Partial<CourseProps>): string {
  return (
    isEmpty(staticCourseName)
    ? `A course at the University of Houston. View grade distribution data at CougarGrades.io.`
    : (
      isEmpty(staticLongDescription)
      ? `${staticCourseName} (${staticDescription}) is a course at the University of Houston. View grade distribution data at CougarGrades.io.`
      : `View grade distribution data for ${staticCourseName} (${staticDescription}). ${staticLongDescription}`
    )
  )
}

export function metaInstructorDescription({ staticInstructorName, staticDepartmentText, staticFullInstructorName }: Partial<InstructorProps>, instructorData: Partial<Instructor> | undefined): string {
  const LIMIT = 3;
  // Common courses include: COSC 1234, MATH 1234, and BEEP 1234.
  const COURSES_TEXT = (
    instructorData !== undefined
    ? (
      Array.isArray(instructorData.courses) && instructorData.courses.length > 0 && isDocumentReferenceArray(instructorData.courses)
      ? (
        'Common courses include: ' +
        toOxfordComma([
          ...(
            instructorData.courses
            .map(doc => doc.id)
            //.map(id => courseIndex.find(course => course.courseName === id))
            .filter(notNullish)
            //.sort() // TODO: sort by enrollment counts, once this has been added: https://github.com/cougargrades/publicdata/issues/30
            .slice(0, LIMIT)
            //.map(e => e.courseName)
          ),
          ...(
            instructorData.courses.length > LIMIT
            ? [`${instructorData.courses.length - LIMIT} ${pluralize({ quantity: instructorData.courses.length - LIMIT, rootWord: 'other'})}`]
            : []
          )
        ]) + '. '
      )
      : ''
    )
    : ''
  );
  return (
    isEmpty(staticFullInstructorName) 
    ? `An instructor at the University of Houston. View grade distribution data at CougarGrades.io.` 
    : `${staticFullInstructorName} is ${isEmpty(staticDepartmentText) || isVowel(staticDepartmentText ?? '') ? 'an ' : 'a ' }${`${unwrap(staticDepartmentText)} `}instructor at the University of Houston. ${COURSES_TEXT}View grade distribution data at CougarGrades.io.`
  )
}

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
