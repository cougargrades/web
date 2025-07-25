import { Course, Instructor } from '@cougargrades/types';
import * as core_curriculum_json from '@cougargrades/publicdata/bundle/edu.uh.publications.core/core_curriculum.json'
//import { firebaseApp } from './ssg';
import { firebase } from '../../firebase_admin'
import { AvailableMetric, CoursePlusMetrics, getAnalyticsReports, InstructorPlusMetrics, RelativeDate, resolveReport } from '../../trending'
import { notNullish } from '../../util'

const core_curriculum = new Set(Array.from(core_curriculum_json).map(row => `${row.department} ${row.catalogNumber}`))

export type TopMetric = 'totalEnrolled' | AvailableMetric
export type TopTopic = 'course' | 'instructor';
export type TopLimit = number;
export type TopTime = 'all' | 'lastMonth' | 'lastYear'
export const time2RelativeDate: Record<TopTime, RelativeDate> = {
  'all': '2019-01-01',
  'lastMonth': '30daysAgo',
  'lastYear': '365daysAgo',
}
export interface TopOptions {
  metric: TopMetric;
  topic: TopTopic;
  limit: TopLimit;
  time: TopTime;
  hideCore: boolean;
}

export async function getTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<(CoursePlusMetrics | InstructorPlusMetrics)[]> {
  if (metric === 'totalEnrolled') {
    const db = firebase.firestore();
    const stream = db
      .collection(topic === 'course' ? 'catalog' : 'instructors')
      .orderBy('enrollment.totalEnrolled', 'desc')
      .stream();
    
    // Store the snapshots we're going to stream
    const snapshots: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];

    // This is something you can do in newer versions of Node.js. Pretty neat.
    for await (const chunk of stream) {
      // cast our chunk as a snapshot
      const snap = chunk as unknown as FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>;
      // End the stream if we capture the amount we want
      if (snapshots.length >= limit) break;
      // Pull data back
      const data = snap.data() as (Course | Instructor);
      // if we're trying to not include "Core" courses, AND this snapshot is a course, AND it's a "Core" course, don't include it!
      if (hideCore && data && 'instructors' in data && core_curriculum.has(data._id)) {
        continue;
      }
      // otherwise, push it
      snapshots.push(snap);
    }
    
    return [
      ...(
        snapshots
          .map(doc => doc.data() as (Course | Instructor))
          .map(e => ({
            ...e,
            courses: [],
            sections: [],
            instructors: [],
            groups: [],
            keywords: [],
          }))
      )
    ]
  }
  else {
    const reportTime: RelativeDate = time2RelativeDate[time];
    const cleanedReports = await getAnalyticsReports(limit, metric, reportTime, topic);
    const resolved = await Promise.all(cleanedReports.map(row => resolveReport(row)));

    // TODO: filter by "core" or not at the server level

    return [
      ...(
        resolved
          .filter(notNullish)
          .slice(0, limit)
          .map(e => ({
            ...e,
            courses: [],
            sections: [],
            instructors: [],
            groups: [],
            keywords: [],
          }))
      )
    ];
  }
}