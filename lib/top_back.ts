import { Course, Instructor } from '@cougargrades/types';
import { firebaseApp } from './ssg';
import { AvailableMetric, CoursePlusMetrics, getAnalyticsReports, InstructorPlusMetrics, RelativeDate, resolveReport } from './trending';

export type TopMetric = 'totalEnrolled' | AvailableMetric
export type TopTopic = 'course' | 'instructor';
export type TopLimit = number;
export type TopTime = 'all' | 'lastMonth'
export interface TopOptions {
  metric: TopMetric;
  topic: TopTopic;
  limit: TopLimit;
  time: TopTime;
}

export async function getTopResults({ metric, topic, limit, time }: TopOptions): Promise<(CoursePlusMetrics | InstructorPlusMetrics)[]> {
  if (metric === 'totalEnrolled') {
    const db = firebaseApp.firestore();
    const query = db.collection(topic === 'course' ? 'catalog' : 'instructors').orderBy('enrollment.totalEnrolled', 'desc').limit(limit)
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
    const reportTime: RelativeDate = time === 'all' ? '2019-01-01' : '30daysAgo';
    const cleanedReports = await getAnalyticsReports(limit, metric, reportTime, topic);
    const resolved = await Promise.all(cleanedReports.map(row => resolveReport(row)));

    return [
      ...(
        resolved
          .filter(item => item !== null && item !== undefined)
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
