
import { env } from 'cloudflare:workers'
import { firestore as _firestore, FirestoreCredentials } from '@cougargrades/vendor/firestore'
import { firestore as _firestore2 } from '@cougargrades/vendor/firestore_grpc'

export const GOOGLE_APPLICATION_CREDENTIALS = FirestoreCredentials.parse(JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS)));

export const PROJECT_ID = GOOGLE_APPLICATION_CREDENTIALS.project_id;

//export const firestore = () => _firestore(GOOGLE_APPLICATION_CREDENTIALS);
export const firestore = () => _firestore2(GOOGLE_APPLICATION_CREDENTIALS);
