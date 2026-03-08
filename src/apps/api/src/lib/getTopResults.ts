
import { BinnedSparklineData, DocumentPathToPathname, PathnameToDocumentPath, PopConMetric, PopConMetric2PlusMetricKey, SparklineData, TopMetric2PopConMetric } from '@cougargrades/models'
import { stream } from '@cougargrades/vendor/firestore'
import { CoursePlusMetrics, InstructorPlusMetrics, RankingResult, TopOptions, TopResult, TopTime2BinSize, TopTime2Duration, ToTopResult } from '@cougargrades/models/dto'
import core_curriculum_json from '@cougargrades/publicdata/bundle/edu.uh.publications.core/core_curriculum.json'
import { Temporal } from 'temporal-polyfill';
import { firestore, getFirestoreDocumentSafe } from './firestore-config'
import { getPopConTopPages, getRankForPathname, getSparklineForPathname, PopConTopResult, streamPopConTopPages } from './popconHelper';
import { isNullish } from '@cougargrades/utils/nullish'
import { GetTimeRangeFromDurationBeforeNow, UTC_TIMEZONE_ID } from '@cougargrades/utils/temporal'

const core_curriculum = new Set(Array.from(core_curriculum_json).map(row => `${row.department} ${row.catalogNumber}`))
const core_curriculum_pathnames = new Set(
  Array.from(core_curriculum)
    .map(courseName => DocumentPathToPathname(`catalog/${courseName}`))
    .filter<string>((p): p is string => !isNullish(p))
)

export const CourseOrInstructorPlusMetrics = CoursePlusMetrics.or(InstructorPlusMetrics);

export async function getTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<TopResult[]> {
  const seen = new Set<string>();
  if (metric === 'totalEnrolled') {
    const db = firestore();
    const query = db.collection(topic === 'course' ? 'catalog' : 'instructors')
        .orderBy('enrollment.totalEnrolled', 'desc');
    
    let result: (CoursePlusMetrics | InstructorPlusMetrics)[] = [];

    // This is something you can do in newer versions of Node.js. Pretty neat.
    for await (const doc of stream(query)) {
      // End the stream if we capture the amount we want
      if (result.length >= limit) break;

      // Do nothing if it doesn't exist lol
      if (!doc.exists) continue;

      // Check if data is valid
      const parsed = CourseOrInstructorPlusMetrics.safeParse(doc.data())
      if (!parsed.success) {
        console.debug(`[getTopResults] Failed to parse as 'CourseOrInstructorPlusMetrics': `, parsed.error);
        console.debug(`[getTopResults] Failed data: `, doc.data());
        continue;
      }

      // Check if data passes our rules
      // if we're trying to not include "Core" courses, AND this snapshot is a course, AND it's a "Core" course, don't include it!
      if (hideCore && 'catalogNumber' in parsed.data && core_curriculum.has(parsed.data._id)) {
        continue;
      }
      if (!seen.has(parsed.data._id)) {
        // otherwise, push it
        result.push(parsed.data);
        // mark as seen
        seen.add(parsed.data._id);
      }
    }
    
    return result.map(r => ToTopResult(r, { metric, }));
  }
  else if (metric === 'pageView') {
    // Convert `Top` parameters into `PopCon` parameters
    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({ years: 999 });
    const nowUTC = Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID);
    const timeRange = GetTimeRangeFromDurationBeforeNow(nowUTC, topDuration);

    let rankedPopcons: PopConTopResult[] = [];

    /**
     * Stream the top visited PopCon pathnames
     * 
     * Stream it because it's the most syntactically simple
     * way to keep asking for more if we find rows that we don't want (core curriculum filter).
     */
    for await (const row of streamPopConTopPages({ metric: pMetric, topic, timeRange, chunkSize: limit })) {
      // End the stream if we capture the amount we want
      if (rankedPopcons.length >= limit) break;

      // Skip this row if it's one we're supposed to avoid
      if (hideCore && topic === 'course' && core_curriculum_pathnames.has(row.pathname)) {
        continue;
      }

      if (!seen.has(row.pathname)) {
        // otherwise, push it
        rankedPopcons.push(row);
        // mark as seen
        seen.add(row.pathname);
      }
    }

    const resolved = await Promise.allSettled(rankedPopcons.map(async (pc) => {
      const documentPath = PathnameToDocumentPath(pc.pathname);
      if (isNullish(documentPath)) return null;

      if (documentPath.startsWith('catalog')) {
        // Get the "Course" document
        const doc = await getFirestoreDocumentSafe(documentPath, CoursePlusMetrics);
        if (!doc.success) return null;

        // Based on the `pMetric` being searched, find out what property in `PlusMetrics` needs to be updated as a result
        const plusMetricKey = PopConMetric2PlusMetricKey.get(pMetric);
        if (isNullish(plusMetricKey)) return null;

        // Store the metric value we queried in the correct property
        doc.data[plusMetricKey] = pc.metric_count_sum;

        return doc.data;
      }
      else if (documentPath.startsWith('instructors')) {
        // Get the "Course" document
        const doc = await getFirestoreDocumentSafe(documentPath, InstructorPlusMetrics);
        if (!doc.success) return null;

        // Based on the `pMetric` being searched, find out what property in `PlusMetrics` needs to be updated as a result
        const plusMetricKey = PopConMetric2PlusMetricKey.get(pMetric);
        if (isNullish(plusMetricKey)) return null;

        // Store the metric value we queried in the correct property
        doc.data[plusMetricKey] = pc.metric_count_sum;

        return doc.data;
      }
      
      return null;
    }))

    return resolved
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter((r): r is CoursePlusMetrics | InstructorPlusMetrics => !isNullish(r))
      .map(r => ToTopResult(r, { metric, }));
  }

  return [];
}

/**
 * Used to get the ranking for a Course based on `TopOptions`
 * @param courseName 
 * @param param1 
 * @returns 
 */
export async function getRankForCourse(courseName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<RankingResult | null> {
  if (metric === 'totalEnrolled') {
    // TODO: this is not yet supported
    return null
  }
  else if (metric === 'pageView') {
    // Convert `Top` parameters into `PopCon` parameters
    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({ years: 999 });
    const nowUTC = Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID);
    const timeRange = GetTimeRangeFromDurationBeforeNow(nowUTC, topDuration);

    const pathname = DocumentPathToPathname(`catalog/${courseName}`);
    if (isNullish(pathname)) return null;

    // Get the top visited PopCon pathnames 
    const rank = await getRankForPathname(pathname, {
      metric: pMetric,
      topic: 'course',
      timeRange
    })

    return rank;
  }

  return null;
}

/**
 * Used to get the ranking for an Instructor based on `TopOptions`
 * @param instructorName 
 * @param param1 
 * @returns 
 */
export async function getRankForInstructor(instructorName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<RankingResult | null> {
  if (metric === 'totalEnrolled') {
    // TODO: this is not yet supported
    return null
  }
  else if (metric === 'pageView') {
    // Convert `Top` parameters into `PopCon` parameters
    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({ years: 999 });
    const nowUTC = Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID);
    const timeRange = GetTimeRangeFromDurationBeforeNow(nowUTC, topDuration);

    const pathname = DocumentPathToPathname(`catalog/${instructorName}`);
    if (isNullish(pathname)) return null;

    // Get the top visited PopCon pathnames 
    const rank = await getRankForPathname(pathname, {
      metric: pMetric,
      topic: 'instructor',
      timeRange
    })

    return rank;
  }

  return null;
}

/**
 * Used to get the ranking for a Course based on `TopOptions`
 * @param courseName 
 * @param param1 
 * @returns 
 */
export async function getSparklineForCourse(courseName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<BinnedSparklineData | null> {
  if (metric === 'totalEnrolled') {
    // TODO: this is not yet supported
    return null
  }
  else if (metric === 'pageView') {
    // Convert `Top` parameters into `PopCon` parameters
    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({ years: 999 });
    const nowUTC = Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID);
    const timeRange = GetTimeRangeFromDurationBeforeNow(nowUTC, topDuration);
    const binSize = TopTime2BinSize.get(time) ?? Temporal.Duration.from({ days: 1 });

    const pathname = DocumentPathToPathname(`catalog/${courseName}`);
    if (isNullish(pathname)) return null;

    // Get the top visited PopCon pathnames 
    const sparkline = await getSparklineForPathname(pathname, binSize, {
      metric: pMetric,
      topic: 'course',
      timeRange
    })

    return sparkline;
  }

  return null;
}

/**
 * Used to get the ranking for an Instructor based on `TopOptions`
 * @param instructorName 
 * @param param1 
 * @returns 
 */
export async function getSparklineForInstructor(instructorName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<BinnedSparklineData | null> {
  if (metric === 'totalEnrolled') {
    // TODO: this is not yet supported
    return null
  }
  else if (metric === 'pageView') {
    // Convert `Top` parameters into `PopCon` parameters
    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({ years: 999 });
    const nowUTC = Temporal.Now.zonedDateTimeISO(UTC_TIMEZONE_ID);
    const timeRange = GetTimeRangeFromDurationBeforeNow(nowUTC, topDuration);
    const binSize = TopTime2BinSize.get(time) ?? Temporal.Duration.from({ days: 1 });

    const pathname = DocumentPathToPathname(`catalog/${instructorName}`);
    if (isNullish(pathname)) return null;

    // Get the top visited PopCon pathnames 
    const sparkline = await getSparklineForPathname(pathname, binSize, {
      metric: pMetric,
      topic: 'instructor',
      timeRange
    })

    return sparkline;
  }

  return null;
}
