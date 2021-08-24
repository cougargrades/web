import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { Course, Instructor, Group } from '@cougargrades/types'
import { getGradeForGPA, getGradeForStdDev, grade2Color } from '../../components/badge'
import { Observable } from './Observable'
import { getBadges } from './getBadges';

export interface SearchResultBadge {
  key: string;
  text: string;
  color: string;
  caption?: string;
}

export interface SearchResult {
  key: string; // used for react, same as document path
  href: string; // where to redirect the user when selected
  type: 'course' | 'instructor' | 'group';
  group: string; // What to display in the <li> divider in the search results
  title: string; // What the result is
  badges: SearchResultBadge[]
}

export function course2Result(data: Course): SearchResult {
  return {
    key: data._path,
    href: `/c/${data._id}`,
    type: 'course',
    group: '📚 Courses',
    title: `${data._id}: ${data.description}`,
    badges: getBadges(data.GPA, data.enrollment),
  };
}

export function instructor2Result(data: Instructor): SearchResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    type: 'instructor',
    group: '👩‍🏫 Instructors',
    title: data._id,
    badges: getBadges(data.GPA, data.enrollment),
  };
}

export function group2Result(data: Group): SearchResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    type: 'group',
    group: '🗃️ Groups',
    title: `${data.name} (${data.identifier})`,
    badges: [],
  };
}

function getFirst<T>(arr: (T | undefined)[]): T | undefined {
  const subset = arr.filter(e => e !== undefined);
  if(subset.length > 0) {
    return subset[0]
  }
  return undefined
}

// reference: https://stackoverflow.com/a/1129270/4852536
const sortByTitle = (inputValue: string) => (a: SearchResult, b: SearchResult) => {
  // if A matches title but B doesn't
  if(a.title.toUpperCase().startsWith(inputValue.toUpperCase()) && !b.title.toUpperCase().startsWith(inputValue.toUpperCase())) {
    return -2;
  }
  // if B matches title but A doesn't
  else if(! a.title.toUpperCase().startsWith(inputValue.toUpperCase()) && b.title.toUpperCase().startsWith(inputValue.toUpperCase())) {
    return 2;
  }
  else {
    // otherwise, return alphabetically
    return a.title.toUpperCase() < b.title.toUpperCase() ? -1 : (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : 0);
  }
};

export function useSearchResults(inputValue: string): Observable<SearchResult[]> {
  const SEARCH_RESULT_LIMIT = 5;
  const COURSE_EXACT_SEARCH_RESULT_LIMIT = 3;
  const COURSE_SEARCH_RESULT_LIMIT = 2;
  const db = useFirestore()
  // Search for courses
  const courseQuery = db.collection('catalog').where('keywords', 'array-contains', inputValue.toLowerCase()).limit(COURSE_SEARCH_RESULT_LIMIT)
  const courseData = useFirestoreCollectionData<Course>(courseQuery)
  // Search for courses that start with the given department code
  // reference: https://stackoverflow.com/a/57290806/4852536
  const courseByDeptQuery = db.collection('catalog').where('department', '>=', inputValue.toUpperCase()).where('department', '<', inputValue.toUpperCase().replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))).limit(COURSE_EXACT_SEARCH_RESULT_LIMIT)
  const courseByDeptData = useFirestoreCollectionData<Course>(courseByDeptQuery);
  // Search for instructors
  const instructorQuery = db.collection('instructors').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('lastName').limit(SEARCH_RESULT_LIMIT)
  const instructorData = useFirestoreCollectionData<Instructor>(instructorQuery)
  // Search for groups
  const groupQuery = db.collection('groups').where('keywords', 'array-contains', inputValue.toLowerCase()).orderBy('name').limit(SEARCH_RESULT_LIMIT)
  const groupData = useFirestoreCollectionData<Group>(groupQuery)

  try {
    return {
      data: [
        ...[
          ...(courseByDeptData.status === 'success' ? courseByDeptData.data.map(e => course2Result(e)) : []),
          ...(courseData.status === 'success' ? courseData.data.map(e => course2Result(e)) : [])
        ]
          // remove duplicates
          // reference: https://stackoverflow.com/a/56757215/4852536
          .filter((item, index, self) => index === self.findIndex(e => (e.key === item.key)))
          // put exact title matches first
          .sort(sortByTitle(inputValue)),
        ...(instructorData.status === 'success' ? instructorData.data.map(e => instructor2Result(e)) : []).sort(sortByTitle(inputValue)),
        ...(groupData.status === 'success' ? groupData.data.map(e => group2Result(e)) : []).sort(sortByTitle(inputValue)),
      ],
      /**
       * If compareFunction(a, b) returns value > than 0, sort b before a.
       * If compareFunction(a, b) returns value ≤ 0, leave a and b in the same order.
       * If inconsistent results are returned, then the sort order is undefined.
       */
      error: getFirst([courseData.error, instructorData.error, groupData.error]),
      status: inputValue === '' ? 'success' : [courseData.status, instructorData.status, groupData.status].some(e => e === 'loading') ? 'loading' : 'success'
    }
  }
  catch(error) {
    return {
      data: [],
      error,
      status: 'error',
    }
  }
}
