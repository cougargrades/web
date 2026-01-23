import { firebase } from '../../firebase_admin'

/**
 * Used in serverless functions
 */
export async function getLatestTerm(): Promise<number | null> {
  const db = firebase.firestore();
  const snap = await db.collection('sections')
    .orderBy('term', 'desc')
    .limit(1)
    .get();
  
  if (snap.empty) return null;
  if (snap.docs.length === 0) return null;
  const data = snap.docs[0].data();
  if ('term' in data && typeof data.term === 'number') {
    return data.term
  }
  else {
    return null;
  }
}
