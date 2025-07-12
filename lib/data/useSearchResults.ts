//import React from 'react'
import { Course, Instructor, Group } from '@cougargrades/types'
import useSWR from 'swr/immutable'
import { useAsync } from 'react-use'
import { RetrievedDoc, search } from '@lyrasearch/lyra'
import { z } from 'zod/mini'
import type { Property } from 'csstype'
import { Observable } from './Observable'
import { getBadges } from './getBadges'
import { useLyra } from '../lyra'
import { grade2Color, SEARCH_RESULT_COLOR } from '../../components/badge'
import { average, normalizeOne, scaleToRange, shareOf, sum } from '../util'
//import { firebaseApp } from '../ssg'
//import { firebase } from '../firebase_admin'

export interface SearchResultBadge {
  key: string;
  text: string;
  color: string;
  opacity?: number;
  caption?: string;
  title?: string;
  suffix?: string;
  fontSize?: Property.FontSize;
}

export const SearchResultType = z.enum(['course', 'instructor', 'group']);
export type SearchResultType = z.infer<typeof SearchResultType>

export interface SearchResult {
  key: string; // used for react, same as document path
  href: string; // where to redirect the user when selected
  type: SearchResultType;
  group: string; // What to display in the <li> divider in the search results
  title: string; // What the result is
  badges: SearchResultBadge[];
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
  //const suffix = isCoreCurrGroup ? ' (Core)' : isSubjectGroup ? ' (Subject)' : '';
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    type: 'group',
    group: '🗃️ Groups',
    title: `${data.name}`,
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

export function percentageOfBM25Score(score: number, otherResults: RetrievedDoc<any>[]) {
  const otherScores = otherResults.map(e => e.score)
  return shareOf(score, otherScores)
}

export function useLiteSearchResults(inputValue: string, enableLyra: boolean): Observable<SearchResult[]> {
  const { data: trendingData, error: trendingError } = useSWR<SearchResult[]>('/api/trending');
  const lyra = useLyra(enableLyra)

  const courseResults = useAsync(async () => {
    if (lyra.value !== undefined) {
      const { courseDb } = lyra.value
      return await search(courseDb, {
        term: inputValue,
        properties: ['courseName', 'description', 'publicationTextContent'],
        boost: {
          courseName: 2.0,
          description: 1.0,
          publicationTextContent: 0.5,
        },
        tolerance: 1,
        limit: 10,
      })
    }
    return undefined
  }, [inputValue, lyra.value])

  const instructorResults = useAsync(async () => {
    if (lyra.value !== undefined) {
      const { instructorDb } = lyra.value
      return await search(instructorDb, {
        term: inputValue,
        properties: ['firstName', 'lastName'],
        tolerance: 1,
        limit: 10,
      })
    }
    return undefined
  }, [inputValue, lyra.value])

  const allErrors = [lyra.error, courseResults.error, instructorResults.error]
  const allLoading = [lyra.loading, courseResults.loading, instructorResults.loading]

  const courseHits = courseResults?.value?.hits
  const instructorHits = instructorResults?.value?.hits


  const courseData: SearchResult[] = Array.isArray(courseHits) ? courseHits.map(hit => {
    const normalizedScore = percentageOfBM25Score(hit.score, courseHits);
    const normalizedHits = courseHits.map(e => percentageOfBM25Score(e.score, courseHits))
    const averageScore = average(normalizedHits)
    // only "significant" results should have a full opacity
    const opacity = scaleToRange(normalizeOne(normalizedScore, normalizedHits), [0.35, 1.0])
    return {
      key: hit.id,
      href: hit.document.href,
      type: 'course',
      group: '📚 Courses',
      title: `${hit.document.courseName}: ${hit.document.description}`,
      badges: [
        {
          key: 'score',
          title: `${normalizedScore.toFixed(1)}% match, Okapi BM25 score: ${hit.score.toFixed(2)}`,
          text: `${normalizedScore.toFixed(1)}%`,
          suffix: ' 🔎',
          color: SEARCH_RESULT_COLOR,
          // only "significant" results should have a full opacity
          opacity,
          // make search result badges smaller
          fontSize: '0.7em',
        }
      ],
    }
  }) : [];
  const instructorData: SearchResult[] = Array.isArray(instructorHits) ? instructorHits.map(hit => {
    const normalizedScore = percentageOfBM25Score(hit.score, instructorHits);
    const normalizedHits = instructorHits.map(e => percentageOfBM25Score(e.score, instructorHits))
    const averageScore = average(normalizedHits)
    // only "significant" results should have a full opacity
    const opacity = scaleToRange(normalizeOne(normalizedScore, normalizedHits), [0.35, 1.0])
    return {
      key: hit.id,
      href: hit.document.href,
      type: 'instructor',
      group: '👩‍🏫 Instructors',
      title: `${hit.document.firstName} ${hit.document.lastName}`,
      badges: [
        {
          key: 'score',
          title: `${normalizedScore.toFixed(1)}% match, Okapi BM25 score: ${hit.score.toFixed(2)}`,
          text: `${normalizedScore.toFixed(1)}%`,
          suffix: ' 🔎',
          color: SEARCH_RESULT_COLOR,
          // only "significant" results should have a full opacity
          opacity,
          // make search result badges smaller
          fontSize: '0.7em',
        }
      ],
    }
  }) : [];

  try {
    return {
      data: [
        ...(Array.isArray(trendingData) ? trendingData : [])
          .filter(trend => trend.title.includes(inputValue)),
        ...courseData,
        ...instructorData,
      ],
      error: getFirst([ lyra.error, courseResults.error, instructorResults.error ]),
      status: allErrors.some(e => e !== undefined) ? 'error' : allLoading.some(e => e) ? 'loading' : 'success'
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
