import { Course, Group, Instructor } from '@cougargrades/types'
import { firebase } from '../../firebase_admin'
import { course2Result, group2Result, instructor2Result, SearchResult, sortByTitle } from '../useSearchResults'

export async function getSearchResults(inputValue: string): Promise<SearchResult[]> {
  const SEARCH_RESULT_LIMIT = 5;
  const COURSE_EXACT_SEARCH_RESULT_LIMIT = 3;
  const COURSE_SEARCH_RESULT_LIMIT = 2;

  const db = firebase.firestore();
  // Search for courses
  const courseQuery = db.collection('catalog').where('keywords', 'array-contains', inputValue.toLowerCase()).limit(COURSE_SEARCH_RESULT_LIMIT)
  // Search for courses that start with the given department code
  // reference: https://stackoverflow.com/a/57290806/4852536
  const courseByDeptQuery = db.collection('catalog').where('department', '>=', inputValue.toUpperCase()).where('department', '<', inputValue.toUpperCase().replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))).limit(COURSE_EXACT_SEARCH_RESULT_LIMIT)
  // Search for instructors
  const instructorQuery = db.collection('instructors').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('lastName').limit(SEARCH_RESULT_LIMIT)
  // Search for groups
  const groupQuery = db.collection('groups').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('name').limit(SEARCH_RESULT_LIMIT)

  const searchSnapshots = await Promise.allSettled([
    courseQuery.get(),
    courseByDeptQuery.get(),
    instructorQuery.get(),
    groupQuery.get(),
  ])

  const [courseSnap, courseByDeptSnap, instructorSnap, groupSnap] = searchSnapshots;

  return [
    ...[
      ...(courseByDeptSnap.status === 'fulfilled' ? courseByDeptSnap.value.docs.map(e => e.data() as Course).map(e => course2Result(e)) : []),
      ...(courseSnap.status === 'fulfilled' ? courseSnap.value.docs.map(e => e.data() as Course).map(e => course2Result(e)) : []),
    ]
      // remove duplicates
      // reference: https://stackoverflow.com/a/56757215/4852536
      .filter((item, index, self) => index === self.findIndex(e => (e.key === item.key)))
      // put exact title matches first
      .sort(sortByTitle(inputValue)),
    ...(instructorSnap.status === 'fulfilled' ? instructorSnap.value.docs.map(e => e.data() as Instructor).map(e => instructor2Result(e)).sort(sortByTitle(inputValue)) : []),
    ...(groupSnap.status === 'fulfilled' ? groupSnap.value.docs.map(e => e.data() as Group).map(e => group2Result(e)).sort(sortByTitle(inputValue)) : []),
  ]
}


