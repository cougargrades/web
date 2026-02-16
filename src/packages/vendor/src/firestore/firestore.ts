
import { z } from 'zod'
import { auth, firestore as _firestore } from '@googleapis/firestore'

export type FirestoreCredentials = z.infer<typeof FirestoreCredentials>
/**
 * Based off of: 
 * - JWT.fromJSON(): https://github.com/googleapis/google-cloud-node-core/blob/fb493877201a456b8b34c59317812e4e43a3db83/packages/google-auth-library-nodejs/src/auth/jwtclient.ts#L312
 * - JWTInput: https://github.com/googleapis/google-cloud-node-core/blob/fb493877201a456b8b34c59317812e4e43a3db83/packages/google-auth-library-nodejs/src/auth/credentials.ts#L69
 */
export const FirestoreCredentials = z.object({
  type: z.string().optional(),
  project_id: z.string(),
  private_key_id: z.string().optional(),
  private_key: z.string(),
  client_email: z.string(),
  client_id: z.string().optional(),
  auth_uri: z.string().optional(),
  token_uri: z.string().optional(),
  auth_provider_x509_cert_url: z.string().optional(),
  client_x509_cert_url: z.string().optional(),
})

//JSON.parse(atob(env.GOOGLE_APPLICATION_CREDENTIALS))

export function firestore(credentials: FirestoreCredentials) {
  const authClient = new auth.JWT();
  authClient.fromJSON(credentials);
  authClient.scopes = ['https://www.googleapis.com/auth/datastore'];
  //const cred = await authClient.authorize()
  //const cred = await authClient.getCredentials();

  const db = _firestore({
    version: 'v1',
    auth: authClient,
    //credentials: cred,
    //auth: cred
  })
  return db;
}
