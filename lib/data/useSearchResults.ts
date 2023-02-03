import { Course, Instructor, Group } from '@cougargrades/types'
import useSWR from 'swr/immutable'
import { Observable } from './Observable'
import { getBadges } from './getBadges';
//import { firebaseApp } from '../ssg'
//import { firebase } from '../firebase_admin'

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
  const isCoreCurrGroup = Array.isArray(data.categories) && data.categories.includes('#UHCoreCurriculum');
  const isSubjectGroup = Array.isArray(data.categories) && data.categories.includes('#UHSubject');
  const suffix = isCoreCurrGroup ? ' (Core)' : isSubjectGroup ? ' (Subject)' : '';
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    type: 'group',
    group: '🗃️ Groups',
    title: `${data.name}${suffix}`,
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

/**
 * If compareFunction(a, b) returns value > than 0, sort b before a.
 * If compareFunction(a, b) returns value ≤ 0, leave a and b in the same order.
 * If inconsistent results are returned, then the sort order is undefined.
 * reference: https://stackoverflow.com/a/1129270/4852536
 */
export const sortByTitle = (inputValue: string) => (a: SearchResult, b: SearchResult) => {
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
  const { data: searchData, error: searchError } = useSWR<SearchResult[]>(`/api/search?${new URLSearchParams({ q: inputValue.toLowerCase() })}`);
  const { data: trendingData, error: trendingError } = useSWR<SearchResult[]>('/api/trending');

  try {
    return {
      data: [
        ...(Array.isArray(trendingData) ? trendingData : [])
          .filter(trend => trend.title.includes(inputValue)),
        ...(Array.isArray(searchData) ? searchData : []),
      ],
      error: getFirst([ trendingError, searchError ]),
      status: inputValue === '' ? 'success' : [trendingData, searchData].some(e => !Array.isArray(e)) ? 'loading' : 'success'
    }
  }
  catch(error) {
    return {
      data: [],
      error: error as any,
      status: 'error',
    }
  }
}
