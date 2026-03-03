
import { useAsync } from 'react-use';
import { average, normalizeOne, scaleToRange, shareOf } from '@cougargrades/models'
import type { SearchResult } from '@cougargrades/models/dto'
import { isNullish } from '@cougargrades/utils/nullish';
//import { RetrievedDoc, search } from '@lyrasearch/lyra'
import { search } from '@orama/orama'
import { useTrending } from './useTrending';
import { useLyra } from './useLyra';
import { SEARCH_RESULT_COLOR } from '../../components/badge';
import type { Observable } from './Observable';



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

export function percentageOfBM25Score(score: number, otherScores: number[]) {
  return shareOf(score, otherScores)
}

export function useLiteSearchResults(inputValue: string, enableLyra: boolean): Observable<SearchResult[]> {
  const { data: trendingData, error: trendingError } = useTrending();
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
      });
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

  const groupResults = useAsync(async () => {
    if (lyra.value !== undefined) {
      const { groupDb } = lyra.value;
      return await search(groupDb, {
        term: inputValue,
        properties: ['identifier', 'name', 'description'],
        boost: {
          identifier: 2.0,
          name: 1.0,
          description: 0.5,
        },
        tolerance: 1,
        limit: 10,
      })
    }
  }, [inputValue, lyra.value])

  const allErrors = [lyra.error, courseResults.error, instructorResults.error, groupResults.error]
  const allLoading = [lyra.loading, courseResults.loading, instructorResults.loading, groupResults.loading]

  const courseHits = courseResults?.value?.hits
  const instructorHits = instructorResults?.value?.hits
  const groupHits = groupResults?.value?.hits

  const courseData: SearchResult[] = Array.isArray(courseHits) ? courseHits.map<SearchResult>(hit => {
    const normalizedScore = percentageOfBM25Score(hit.score, courseHits.map(h => h.score));
    const normalizedHits = courseHits.map(e => percentageOfBM25Score(e.score, courseHits.map(h => h.score)))
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
    } satisfies SearchResult
  }) : [];
  const instructorData: SearchResult[] = Array.isArray(instructorHits) ? instructorHits.map(hit => {
    const normalizedScore = percentageOfBM25Score(hit.score, instructorHits.map(h => h.score));
    const normalizedHits = instructorHits.map(e => percentageOfBM25Score(e.score, instructorHits.map(h => h.score)))
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
  const groupData: SearchResult[] = Array.isArray(groupHits) ? groupHits.map(hit => {
    const normalizedScore = percentageOfBM25Score(hit.score, groupHits.map(h => h.score));
    const normalizedHits = groupHits.map(e => percentageOfBM25Score(e.score, groupHits.map(h => h.score)))
    const averageScore = average(normalizedHits)
    // only "significant" results should have a full opacity
    const opacity = scaleToRange(normalizeOne(normalizedScore, normalizedHits), [0.35, 1.0])
    return {
      key: hit.id,
      href: hit.document.href,
      type: 'group',
      group: '🗃️ Groups',
      title: `${hit.document.name}`,
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
        ...groupData,
      ],
      error: allErrors.find(e => !isNullish(e)) ?? null,
      status: allErrors.some(e => e !== undefined) ? 'error' : allLoading.some(e => e) ? 'pending' : 'success'
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
