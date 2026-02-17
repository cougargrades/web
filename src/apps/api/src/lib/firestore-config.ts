
import { env } from 'cloudflare:workers'
import { FirestoreCredentials, firestore as _firestore } from '@cougargrades/vendor/firestore'

// export const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));

//console.log(`🔥 Using Firestore ProjectID = '${GOOGLE_APPLICATION_CREDENTIALS.project_id}'`);


export const firestore = () => {
  const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));
  return _firestore(GOOGLE_APPLICATION_CREDENTIALS);
}
export const db = firestore();
