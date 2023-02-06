import { Instructor } from '@cougargrades/types'
import all_instructors from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_instructors.json'
import { getFirestoreDocument } from './getFirestoreData'
import { getRandomIndexes, notNullish } from '../../util'

/**
 * Used in serverless functions
 * @param courseName 
 * @returns 
 */
export async function getRandomInstuctors(count: number = 5): Promise<Instructor[]> {
  const randomCourseNames: string[] = getRandomIndexes(all_instructors.length, count).map(index => all_instructors[index]);
  const settledData = await Promise.allSettled(randomCourseNames.map(instructorName => (
    getFirestoreDocument<Instructor>(`/instructors/${instructorName}`)
  )))

  return [
    ...(
      settledData
        .map(e => e.status === 'fulfilled' ? e.value : undefined)
        .filter(notNullish)
        // sanitize unwanted document references
        .map(inst => ({ 
          ...inst,
          // property necessary for some client-side calculations
          sectionCount: Array.isArray(inst.sections) ? inst.sections.length : 0,
          sections: [],
          courseCount: Array.isArray(inst.courses) ? inst.courses.length : 0,
          courses: [],
          groups: [],
          keywords: [],
        }))
      )
  ]
}
