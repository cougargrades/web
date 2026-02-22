
import { Course, Instructor, PopConMetric } from '@cougargrades/models'
import { stream } from '@cougargrades/vendor/firestore'
import { CoursePlusMetrics, InstructorPlusMetrics, TopMetric2PopConMetric, TopOptions, TopTime2Duration } from '@cougargrades/models/dto'
import * as core_curriculum_json from '@cougargrades/publicdata/bundle/edu.uh.publications.core/core_curriculum.json'
import { Temporal } from 'temporal-polyfill';
import { firestore } from './firestore-config'
import { getPopConTopPages } from './popconHelper';

const core_curriculum = new Set(Array.from(core_curriculum_json).map(row => `${row.department} ${row.catalogNumber}`))

export const CourseOrInstructorPlusMetrics = CoursePlusMetrics.or(InstructorPlusMetrics);

export async function getTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<(CoursePlusMetrics | InstructorPlusMetrics)[]> {
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
    
    return result
  }
  else {
    // TODO: google analytics

    // TODO: actually do it

    const pMetric = TopMetric2PopConMetric.get(metric) ?? PopConMetric.PageView;
    const topDuration = TopTime2Duration.get(time) ?? Temporal.Duration.from({  years: 999 });
    const timeRange: [Temporal.ZonedDateTime, Temporal.ZonedDateTime] = [Temporal.Now.zonedDateTimeISO().subtract(topDuration), Temporal.Now.zonedDateTimeISO()]

    // metric, topic, limit, time, hideCore
    const rows = await getPopConTopPages({
      metric: pMetric,
      topic,
      timeRange,
      limit,
      offset: 0,
    })

    console.log('rows?', rows);

    return [];
  }
}
