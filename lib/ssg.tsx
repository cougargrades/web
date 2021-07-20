import firebase from 'firebase'
import 'firebase/firestore';
import { firebaseConfig } from '../lib/environment'

export const onlyOne = (value: string | string[]) => Array.isArray(value) ? value[0] : value;

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

export async function getFirestoreDocument<T>(documentPath: string): Promise<T | undefined> {
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
  const db = app.firestore()
  const snap = await db.doc(documentPath).get();
  return snap.exists ? snap.data() as T : undefined
}

export async function getDocumentList(collectionPath: string): Promise<string[]> {
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
  const db = app.firestore()
  const docs = await db.collection(collectionPath).get()
  return docs.docs.map(e => e.id);
}
