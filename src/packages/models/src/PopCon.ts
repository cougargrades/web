import { z } from 'zod'
//import { v4 as uuidv4 } from 'uuid'
import { Temporal } from 'temporal-polyfill'
import { URLPattern } from 'urlpattern-polyfill'
import { trimStart } from 'lodash-es'
import { TopMetric, TopTopic } from './dto/TopDto'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish'
import { PlusMetrics } from './dto/Plus'

// export type PopConMetric = z.infer<typeof PopConMetric>
// export const PopConMetric = z.enum(['page_view'])

// export type PopConMetricID = z.infer<typeof PopConMetric>
// export const PopConMetricID = z.enum([1])

export enum PopConMetric {
  PageView = 1,
  // TODO: Others?
}

export const PopConMetric2PlusMetricKey = new Map<PopConMetric, keyof PlusMetrics>([
  [PopConMetric.PageView, 'screenPageViews']
]);

export const TopMetric2PopConMetric = new Map<TopMetric, PopConMetric>([
  ['pageView', PopConMetric.PageView]
]);

export type PopCon = z.infer<typeof PopCon>
export const PopCon = z.object({
  /**
   * The ID of the object
   */
  id: z.number().int(),
  /**
   * The location on the site being tracked
   * Ex: `/c/CHEM%202323`
   */
  pathname: z.string(),
  /**
   * When the measurement was taken, as a timestamp, in the integer number seconds since the Unix epoch in the UTC timezone.
   */
  //timestamp: z.coerce.date(),
  timestamp_epoch_seconds: z.number().int(),
  /**
   * What metric was being measured
   */
  //type: z.number(),
  type: z.enum(PopConMetric),
})

export type PopConOptions = z.infer<typeof PopConOptions>
export const PopConOptions = z.object({
  metric: z.enum(PopConMetric),
  limit: z.coerce.number().int(),
  offset: z.coerce.number().int().default(0),
  /**
   * [0] = Lower Bound (After)
   * [1] = Upper Bound (Before)
   */
  timeRange: z.tuple([z.instanceof(Temporal.ZonedDateTime), z.instanceof(Temporal.ZonedDateTime)]).optional(),
  topic: TopTopic.optional(),
  exclude: z.array(z.string()).optional(),
})

export function EpochSecondsToTemporal(epoch_seconds: number | bigint): Temporal.ZonedDateTime {
  if (typeof epoch_seconds === 'number') {
    return Temporal.Instant.fromEpochMilliseconds(epoch_seconds * 1000).toZonedDateTimeISO(Temporal.Now.timeZoneId())
  }
  else {
    return Temporal.Instant.fromEpochNanoseconds(epoch_seconds * 1000n * 1000000n).toZonedDateTimeISO(Temporal.Now.timeZoneId());
  }
}

export function ToEpochSeconds(instant: Temporal.Instant | Temporal.ZonedDateTime | Date): number {
  if (instant instanceof Temporal.Instant || instant instanceof Temporal.ZonedDateTime) {
    return Math.round(instant.epochMilliseconds / 1000);
  }
  return Math.round(instant.valueOf() / 1000);
}

const pathnamePattern = new URLPattern({ pathname: `/:tlp/:primaryKey`});
const Tlp2DocumentCollection = new Map<'c' | 'i' | 'g', 'catalog' | 'instructors' | 'groups'>([
  ['c', 'catalog'],
  ['i', 'instructors'],
  ['g', 'groups'],
]);

/**
 * Converts pathnames for PopCon/Google Analytics (ex: `/c/ABCD 1234`) into Firestore document paths (ex: `catalog/ABCD 1234`, or `/catalog/ABCD 1234`)
 * @param pathname 
 * @returns 
 */
export function PathnameToDocumentPath(pathname: string): string | null {
  // Check that pathname matches the pattern we're requiring
  const result = pathnamePattern.exec(`https://hostname/${trimStart(pathname, '/')}`);
  if (isNullish(result)) return null;

  // Check that values were provided for the different parts of the pattern
  const tlp = result.pathname.groups['tlp']?.toLowerCase();
  if (isNullishOrWhitespace(tlp)) return null;
  const primaryKey = result.pathname.groups['primaryKey'];
  if (isNullishOrWhitespace(primaryKey)) return null;

  // Check that TLP (Top-Level Path) matches a known value
  const documentCollection = Tlp2DocumentCollection.get(tlp as any);
  if (isNullish(documentCollection)) return null;

  // Instructors are always lowercase
  if (documentCollection === 'instructors') {
    return `${documentCollection}/${decodeURIComponent(primaryKey).toLowerCase()}`;
  }
  else {
    return `${documentCollection}/${decodeURIComponent(primaryKey)}`
  }
}

/**
 * Converts from document paths (ex: `catalog/ABCD 1234`, or `/catalog/ABCD 1234`) into pathnames for PopCon/Google Analytics pathname (ex: `/c/ABCD 1234`)
 * @param pathname 
 * @returns 
 */
export function DocumentPathToPathname(documentPath: string): string | null {
  if (isNullishOrWhitespace(documentPath)) return null;

  const [ documentCollection, documentId ] = trimStart(documentPath, '/').split('/');

  const matchedKVP = Array.from(Tlp2DocumentCollection.entries()).find(kvp => kvp[1] === documentCollection);
  if (isNullish(matchedKVP)) return null;

  const [tlp, _] = matchedKVP;

  if (tlp === 'i') {
    return `/${tlp}/${encodeURIComponent(documentId.toLowerCase())}`
  }
  else {
    return `/${tlp}/${encodeURIComponent(documentId)}`
  }
}

