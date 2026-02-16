
import { Firestore } from '@google-cloud/firestore'
import { FirestoreCredentials } from './firestore'

export function firestore(credentials: FirestoreCredentials) {
  return new Firestore({
    projectId: credentials.project_id,
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  })
}
