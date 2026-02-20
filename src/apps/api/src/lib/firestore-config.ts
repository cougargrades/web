
import { env } from 'cloudflare:workers'
import { FirestoreCredentials, firestore as _firestore } from '@cougargrades/vendor/firestore'

// export const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));

//console.log(`🔥 Using Firestore ProjectID = '${GOOGLE_APPLICATION_CREDENTIALS.project_id}'`);

type FirestoreClient = ReturnType<typeof _firestore>

let cachedClient: FirestoreClient | undefined = undefined;

export const firestore = () => {
  if (cachedClient) return cachedClient;
  const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));
  cachedClient = _firestore(GOOGLE_APPLICATION_CREDENTIALS);
  return cachedClient;
}
//export const db = firestore();
