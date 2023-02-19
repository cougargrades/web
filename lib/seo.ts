import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import abbreviationMap from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json'
import { Group } from '@cougargrades/types'
import { isEmpty, isVowel, unwrap } from '../i18n/helper'
import { CourseProps } from '../pages/c/[courseName]'
import { InstructorProps } from '../pages/i/[instructorName]'

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

export function metaInstructorDescription({ staticInstructorName, staticDepartmentText, staticFullInstructorName }: Partial<InstructorProps>): string {
  return (
    isEmpty(staticFullInstructorName) 
    ? `An instructor at the University of Houston. View grade distribution data at CougarGrades.io.` 
    : `${staticFullInstructorName} is ${isEmpty(staticDepartmentText) || isVowel(staticDepartmentText ?? '') ? 'an ' : 'a ' }${`${unwrap(staticDepartmentText)} `}instructor at the University of Houston. View grade distribution data at CougarGrades.io.`
  )
}

export function metaFakeGroupDescription(identifier: string, makeLongVersion: boolean = false): string {
  const college = curated_colleges
      .filter(college => !['college-exploratory'].includes(college.identifier))
      .find(college => college.identifier === identifier);
  if (college) {
    const NAME_STARTS_WITH_THE = college.groupLongTitle.toLowerCase().trim().startsWith('the');    
    const SUBJECT_TEXT = college.subjects
      .map(subj => subj in abbreviationMap 
        ? `${abbreviationMap[subj as keyof typeof abbreviationMap]} (${subj})`
        : `"${subj}"`)
      .join(', ');
    const SUFFIX = makeLongVersion ? ` ${SUBJECT_TEXT}.` : ''
    return `Every Subject available in ${NAME_STARTS_WITH_THE ? college.groupLongTitle : `the ${college.groupLongTitle}`}.${SUFFIX}`
  }
  else {
    // Generic description
    return 'A Group of Courses. View grade distribution data at CougarGrades.io.'
  }
}
