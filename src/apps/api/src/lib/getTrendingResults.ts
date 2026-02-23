
import { Temporal } from 'temporal-polyfill';
import { course2SearchResult, instructor2SearchResult, SearchResult } from '@cougargrades/models/dto'
import { Course, Instructor, PathnameToDocumentPath, PopConMetric } from '@cougargrades/models';
import { GetTimeRangeFromDurationBeforeNow } from '@cougargrades/utils/temporal';
import { isNullish } from '@cougargrades/utils/nullish';
import { getPopConTopPages } from './popconHelper';
import { getFirestoreDocumentSafe } from './firestore-config';

const TRENDING_TEXT = '🔥 Popular';

export async function getTrendingResults(limit: number = 5): Promise<SearchResult[]> {
  const last30Days = Temporal.Duration.from({ days: 31 });
  const timeRange = GetTimeRangeFromDurationBeforeNow(last30Days);

  // Get the top visited PopCon pathnames 
  const rankedPopcons = await getPopConTopPages({
    metric: PopConMetric.PageView,
    timeRange,
    limit,
    offset: 0,
  })

  const resolved = await Promise.allSettled(rankedPopcons.map(async (pc) => {
    const documentPath = PathnameToDocumentPath(pc.pathname);
    if (isNullish(documentPath)) return null;

    if (documentPath.startsWith('catalog')) {
      // Get the "Course" document
      const doc = await getFirestoreDocumentSafe(documentPath, Course);
      return doc.data ?? null;
    }
    else if (documentPath.startsWith('instructors')) {
      // Get the "Course" document
      const doc = await getFirestoreDocumentSafe(documentPath, Instructor);
      return doc.data ?? null;
    }
    
    return null;
  }))

  return resolved
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((r): r is Course | Instructor => !isNullish(r))
    .map(item => {
      if ('catalogNumber' in item) {
        const result = course2SearchResult(item);
        result.group = TRENDING_TEXT;
        return result;
      }
      else {
        const result = instructor2SearchResult(item);
        result.group = TRENDING_TEXT;
        return result;
      }
    });
}
