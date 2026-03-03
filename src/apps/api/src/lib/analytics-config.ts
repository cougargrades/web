import * as z4 from 'zod/v4/core';
import { env } from 'cloudflare:workers'
import { Temporal } from 'temporal-polyfill'
import { FirestoreCredentials, firestore as _firestore } from '@cougargrades/vendor/firestore'
import { analyticsDataClient } from '@cougargrades/vendor/google-analytics'

import { DocumentReference, ToDocumentPath } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';

// export const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));

//console.log(`🔥 Using Firestore ProjectID = '${GOOGLE_APPLICATION_CREDENTIALS.project_id}'`);

type AnalyticsClient = ReturnType<typeof analyticsDataClient>

let cachedClient: AnalyticsClient | undefined = undefined;

export const analytics = () => {
  if (cachedClient) return cachedClient;
  const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));
  cachedClient = analyticsDataClient(GOOGLE_APPLICATION_CREDENTIALS);
  return cachedClient;
}


export async function runReport(date: Temporal.PlainDate) {
  const client = analytics();

  const [response] = await client.runReport({
    property: `properties/222080776`,
    dateRanges: [
      {
        // Must be `YYYY-MM-DD`
        // startDate: options.startDate,
        // endDate: options.endDate,
        startDate: date.toString(),
        endDate: date.toString(),
      },
    ],
    dimensions: [
      { name: 'pagePath' }
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

  return response;
}
