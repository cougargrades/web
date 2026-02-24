
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { FirestoreCredentials } from './firestore'


export function analyticsDataClient(credentials: FirestoreCredentials) {
  return new BetaAnalyticsDataClient({ 
    projectId: credentials.project_id,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    }
  });
}
