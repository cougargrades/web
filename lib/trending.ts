import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { course2Result, instructor2Result, SearchResult } from './data/useSearchResults';
import { getFirestoreDocument } from './ssg';
import { Course, Instructor } from '@cougargrades/types';

const credential = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS as any, 'base64').toString());
const propertyId = process.env.GA4_PROPERTY_ID

const analyticsDataClient = new BetaAnalyticsDataClient({ 
  projectId: credential.project_id,
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  }
});

type RelativeDate = 'today' | 'yesterday' | `${bigint}daysAgo`
type AvailableDimension = 'pagePath'
type AvailableMetric = 'activeUsers' | 'screenPageViews'

export interface ReportOptions {
  startDate: RelativeDate
  endDate: RelativeDate
  dimensions: AvailableDimension[]
  metrics: AvailableMetric[],
  limit: number,
  offset: number,
  orderBy: AvailableMetric,
  orderDescending: boolean
}

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

export async function getTrending(limit: number = 5, criteria: AvailableMetric = 'activeUsers'): Promise<SearchResult[]> {
  const dimensions: AvailableDimension[] = ['pagePath']
  const metrics: AvailableMetric[] = ['activeUsers', 'screenPageViews']
  const rawReport = await runReport({
    startDate: '30daysAgo',
    endDate: 'today',
    dimensions: dimensions,
    metrics: metrics,
    limit: limit * 2,
    offset: 0,
    orderBy: criteria,
    orderDescending: true,
  });

  const cleanedReport = rawReport.rows.map(row => {
    let temp: CleanedReport = {} as any;
    dimensions.forEach((item, i) => {
      temp[item] = row.dimensionValues[i].value
    });
    metrics.forEach((item, i) => {
      temp[item] = row.metricValues[i].value
    });
    if(temp['pagePath']) {
      temp['pagePath'] = decodeURI(temp['pagePath']);
    }
    return temp;
  }).filter(item => item.pagePath.startsWith('/c/') || item.pagePath.startsWith('/i/'));

  async function resolveReport(report: CleanedReport): Promise<SearchResult | undefined> {
    if(report.pagePath.startsWith('/c/')) {
      const courseName = report.pagePath.substring('/c/'.length).trim();
      const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`);
      if(courseData) {
        const result = course2Result(courseData);
        result.group = '🔥 Trending';
        return result;
      }
    }
    else if(report.pagePath.startsWith('/i/')) {
      const instructorName = report.pagePath.substring('/i/'.length).trim();
      const instructorData = await getFirestoreDocument<Instructor>(`/instructors/${instructorName}`);
      if(instructorData) {
        const result = instructor2Result(instructorData);
        result.group = '🔥 Trending';
        return result;
      }
    }
    return undefined;
  }

  const resolved = await Promise.all(cleanedReport.map(row => resolveReport(row)));
  return resolved.filter(item => item !== null && item !== undefined).slice(0,limit);
}
