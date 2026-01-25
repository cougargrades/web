
import { createServerOnlyFn } from '@tanstack/react-start'
//import * as admin from 'firebase-admin'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore as _getFirestore } from 'firebase-admin/firestore'
import { env } from 'cloudflare:workers'

const serviceAccount = createServerOnlyFn(() => JSON.parse(Buffer.from(env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString()))
//export const firebase = createServerOnlyFn(() => !admin.apps.length ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount()) }) : admin.app())
export const firebase = createServerOnlyFn(() => {
  const svcAcct = serviceAccount();
  console.log('serviceAccount?', svcAcct);
  const app = initializeApp({ credential: cert(svcAcct) });
  return app;
});
export const getFirestore = createServerOnlyFn(() => _getFirestore(firebase()));

export async function getFirestoreDocument<T>(documentPath: string): Promise<T | undefined> {
  const db = getFirestore();
  console.log('db?', db);
  const snap = await db.doc(documentPath).get();
  return snap.exists ? snap.data() as T : undefined
}

export async function getFirestoreCollection<T>(collectionPath: string): Promise<T[]> {
  const db = getFirestore();
  const docs = await db.collection(collectionPath).get()
  return docs.docs.filter(e => e.exists).map(e => e.data() as T);
}
