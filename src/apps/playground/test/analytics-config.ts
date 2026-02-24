import 'dotenv/config'

import { Temporal } from 'temporal-polyfill'
import { FirestoreCredentials, firestore as _firestore } from '@cougargrades/vendor/firestore'
import { analyticsDataClient } from '@cougargrades/vendor/google-analytics'

type AnalyticsClient = ReturnType<typeof analyticsDataClient>

let cachedClient: AnalyticsClient | undefined = undefined;

export const analytics = () => {
  if (cachedClient) return cachedClient;
  const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '')));
  cachedClient = analyticsDataClient(GOOGLE_APPLICATION_CREDENTIALS);
  return cachedClient;
}


export async function runReport(date: Temporal.PlainDate) {
  const client = analytics();

  const [response] = await client.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        // Must be `YYYY-MM-DD`
        // startDate: options.startDate,
        // endDate: options.endDate,
        startDate: date.subtract(Temporal.Duration.from({ days: 1 })).toString(),
        endDate: date.toString(),
      },
    ],
    dimensions: [
      // pagePath	Page path	The portion of the URL between the hostname and query string for web pages visited; for example, the pagePath portion of https://www.example.com/store/contact-us?query_string=true is /store/contact-us.
      { name: 'pagePath' },
      // dateHourMinute	Date hour and minute	The combined values of date, hour, and minute formatted as YYYYMMDDHHMM.
      { name: 'dateHourMinute' }
    ],
    metrics: [
      { name: 'screenPageViews' }
    ],
    // dimensionFilter: {
    //   filter: {
    //     fieldName: 'pagePath',
    //     stringFilter: {
    //       matchType: 'BEGINS_WITH',
    //       value: filterOnly === 'course' ? '/c/' : '/i/'
    //     }
    //   }
    // },
    // orderBys: [
    //   {
    //     metric: {
    //       metricName: options.orderBy,
    //     },
    //     desc: options.orderDescending,
    //   },
    // ],
    //limit: options.limit,
    //offset: options.offset,
  });
  //debugger;

  return response;
}
