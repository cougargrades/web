import { Course, Instructor } from '@cougargrades/types';
//import { firebaseApp } from './ssg';
import { firebase } from '../../firebase_admin'
import { AvailableMetric, CoursePlusMetrics, getAnalyticsReports, InstructorPlusMetrics, RelativeDate, resolveReport } from '../../trending'
import { notNullish } from '../../util'

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
}

export async function getTopResults({ metric, topic, limit, time }: TopOptions): Promise<(CoursePlusMetrics | InstructorPlusMetrics)[]> {
  if (metric === 'totalEnrolled') {
    const db = firebase.firestore();
    const query = db
      .collection(topic === 'course' ? 'catalog' : 'instructors')
      .orderBy('enrollment.totalEnrolled', 'desc')
      .limit(limit)
    const snap = await query.get()
    
    return [
      ...(
        snap.docs
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