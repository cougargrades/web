import { firebase } from '../../firebase_admin'

export async function getFirestoreDocument<T>(documentPath: string): Promise<T | undefined> {
  const db = firebase.firestore()
  const snap = await db.doc(documentPath).get();
  return snap.exists ? snap.data() as T : undefined
}

export async function getFirestoreCollection<T>(collectionPath: string): Promise<T[]> {
  const db = firebase.firestore()
  const docs = await db.collection(collectionPath).get()
  return docs.docs.filter(e => e.exists).map(e => e.data() as T);
}
