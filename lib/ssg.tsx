// import firebase from 'firebase'
// import 'firebase/firestore'
//import { firebase } from './firebase_admin'

import { firebaseConfig } from '../lib/environment'


/**
 * 
 * @deprecated
 */
export async function getStaticData<T>(func: string, fallback: T = undefined) {
  try {
    const { projectId } = firebaseConfig
    const res = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/${func}`)
    const data: T = await res.json()
    return data;
  }
  catch(err) {
    return fallback
  }
}

/**
 * @deprecated
 */
//export const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

/**
 * 
 * @deprecated
 */
// export async function getFirestoreDocument<T>(documentPath: string): Promise<T | undefined> {
//   const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
//   const db = app.firestore()
//   const snap = await db.doc(documentPath).get();
//   return snap.exists ? snap.data() as T : undefined
// }

/**
 * 
 * @deprecated
 */
// export async function getFirestoreCollection<T>(collectionPath: string): Promise<T[]> {
//   const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
//   const db = app.firestore()
//   const docs = await db.collection(collectionPath).get()
//   return docs.docs.filter(e => e.exists).map(e => e.data() as T);
// }
