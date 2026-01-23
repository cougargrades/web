import { Course } from '@cougargrades/types'
import all_courses from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_courses.json'
import { getFirestoreDocument } from './getFirestoreData'
import { getRandomIndexes, notNullish } from '../../util'

/**
 * Used in serverless functions
 * @param courseName 
 * @returns 
 */
export async function getRandomCourses(count: number = 5): Promise<Course[]> {
  const randomCourseNames: string[] = getRandomIndexes(all_courses.length, count).map(index => all_courses[index]);
  const settledData = await Promise.allSettled(randomCourseNames.map(courseName => (
    getFirestoreDocument<Course>(`/catalog/${courseName}`)
  )))

  return [
    ...(
      settledData
        .map(e => e.status === 'fulfilled' ? e.value : undefined)
        .filter(notNullish)
        // sanitize unwanted document references
        .map(course => ({ 
          ...course,
          // property necessary for some client-side calculations
          sectionCount: Array.isArray(course.sections) ? course.sections.length : 0,
          sections: [],
          instructorCount: Array.isArray(course.instructors) ? course.instructors.length : 0,
          instructors: [],
          groups: [],
          keywords: [],
        }))
      )
  ]
}
