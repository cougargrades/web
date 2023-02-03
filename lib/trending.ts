import { BetaAnalyticsDataClient } from '@google-analytics/data'
import type { google } from '@google-analytics/data/build/protos/protos'
import { Course, Instructor } from '@cougargrades/types';
import { course2Result, instructor2Result, SearchResult } from './data/useSearchResults';
//import { getFirestoreDocument } from './ssg';
import { getFirestoreDocument } from './data/back/getFirestoreData'
import { DateYMDString } from './date'
import { notNullish } from './util'

const credential = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS as any, 'base64').toString());
const propertyId = process.env.GA4_PROPERTY_ID

const analyticsDataClient = new BetaAnalyticsDataClient({ 
  projectId: credential.project_id,
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  }
});


export type RelativeDate = 'today' | 'yesterday' | `${bigint}daysAgo` | DateYMDString;
export type AvailableDimension = 'pagePath' | ''
export type AvailableMetric = 'activeUsers' | 'screenPageViews'
export type DimensionFilterStringMatchType = google.analytics.data.v1beta.Filter.IStringFilter['matchType']

export interface ReportOptions {
  startDate: RelativeDate
  endDate: RelativeDate
  dimensions: AvailableDimension[]
  metrics: AvailableMetric[],
  dimensionFilter?: {
    fieldName: AvailableDimension,
    stringFilter: {
      matchType: DimensionFilterStringMatchType,
      value: string,
    },
  },
  limit: number,
  offset: number,
  orderBy: AvailableMetric,
  orderDescending: boolean
}

/**
 * Underlying call to the Google Analytics API
 * @param options 
 * @returns 
 */
export async function runReport(options: ReportOptions) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: options.startDate,
        endDate: options.endDate,
      },
    ],
    dimensions: options.dimensions.map(dim => ({ name: dim })),
    metrics: options.metrics.map(met => ({ name: met })),
    dimensionFilter: !options.dimensionFilter ? undefined : {
      filter: options.dimensionFilter
    },
    orderBys: [
      {
        metric: {
          metricName: options.orderBy,
        },
        desc: options.orderDescending,
      },
    ],
    limit: options.limit,
    offset: options.offset,
  });

  return response;
}

export interface TrendingItemInfo {
  href: string;
  contentID: string;
}

type CleanedReport = {[key in (AvailableDimension | AvailableMetric)]: string};

/**
 * Query the Google Analytics API by some different criteria
 * @param limit 
 * @param criteria 
 * @param startDate 
 * @returns 
 */
export async function getAnalyticsReports(limit: number = 5, criteria: AvailableMetric = 'activeUsers', startDate: RelativeDate = '30daysAgo', filterOnly: 'course' | 'instructor' | undefined = undefined): Promise<CleanedReport[]> {
  const dimensions: AvailableDimension[] = ['pagePath']
  const metrics: AvailableMetric[] = ['activeUsers', 'screenPageViews']
  const dimensionFilter: ReportOptions['dimensionFilter'] | undefined = filterOnly === undefined ? undefined : {
    fieldName: 'pagePath',
    stringFilter: {
      matchType: 'BEGINS_WITH',
      value: filterOnly === 'course' ? '/c/' : '/i/'
    }
  };
  const rawReport = await runReport({
    startDate: startDate,
    endDate: 'today',
    dimensions: dimensions,
    metrics: metrics,
    dimensionFilter,
    limit: Math.round(limit * 1.5), // sometimes results don't resolve, so we want some buffer space
    offset: 0,
    orderBy: criteria,
    orderDescending: true,
  });

  const cleanedReport = rawReport.rows!.map(row => {
    let temp: CleanedReport = {} as any;
    dimensions.forEach((item, i) => {
      temp[item] = row.dimensionValues![i].value ?? ''
    });
    metrics.forEach((item, i) => {
      temp[item] = row.metricValues![i].value ?? ''
    });
    if(temp['pagePath']) {
      temp['pagePath'] = decodeURI(temp['pagePath']);
    }
    return temp;
  }).filter(item => item.pagePath.startsWith('/c/') || item.pagePath.startsWith('/i/'));

  return cleanedReport;
}

export interface PlusMetrics {
  activeUsers?: number;
  screenPageViews?: number;
}

export interface CoursePlusMetrics extends Course, PlusMetrics {}
export interface InstructorPlusMetrics extends Instructor, PlusMetrics {}

const parseIntOrUndefined = (x: string | undefined): number | undefined => x === undefined ? undefined : isNaN(parseInt(x)) ? undefined : parseInt(x)

/**
 * Turn a report into a Course, Instructor, or undefined if the report's URL didn't correspond to a valid course
 * @param report 
 * @returns 
 */
export async function resolveReport(report: CleanedReport): Promise<CoursePlusMetrics | InstructorPlusMetrics | undefined> {
  if(report.pagePath.startsWith('/c/')) {
    const courseName = report.pagePath.substring('/c/'.length).trim();
    const courseData = await getFirestoreDocument<CoursePlusMetrics>(`/catalog/${courseName}`);
    if(courseData) courseData.activeUsers = parseIntOrUndefined(report?.activeUsers)
    if(courseData) courseData.screenPageViews = parseIntOrUndefined(report?.screenPageViews)
    return courseData;
  }
  else if(report.pagePath.startsWith('/i/')) {
    const instructorName = report.pagePath.substring('/i/'.length).trim();
    const instructorData = await getFirestoreDocument<InstructorPlusMetrics>(`/instructors/${instructorName}`);
    if (instructorData) instructorData.activeUsers = parseIntOrUndefined(report?.activeUsers)
    if (instructorData) instructorData.screenPageViews = parseIntOrUndefined(report?.screenPageViews)
    return instructorData;
  }
  return undefined;
}

/**
 * Transform 
 * @param limit 
 * @param criteria 
 * @returns 
 */
export async function getTrendingResults(limit: number = 5, criteria: AvailableMetric = 'activeUsers'): Promise<SearchResult[]> {
  const cleanedReport = await getAnalyticsReports(limit, criteria);
  const TRENDING_TEXT = '🔥 Popular';

  const resolved: (Course | Instructor | undefined)[] = await Promise.all(cleanedReport.map(row => resolveReport(row)));
  return resolved
    .filter(notNullish)
    .map(item => {
      if ('catalogNumber' in item) {
        const result = course2Result(item);
        result.group = TRENDING_TEXT;
        return result;
      }
      else {
        const result = instructor2Result(item);
        result.group = TRENDING_TEXT;
        return result;
      }
    })
    .slice(0,limit);
}

