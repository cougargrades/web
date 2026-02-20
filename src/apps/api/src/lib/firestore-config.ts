import * as z4 from 'zod/v4/core';
import { env } from 'cloudflare:workers'
import { FirestoreCredentials, firestore as _firestore } from '@cougargrades/vendor/firestore'
import { DocumentReference, ToDocumentPath } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';

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

export async function getFirestoreDocumentSafe<T extends z4.$ZodType>(documentPathOrRef: string | DocumentReference, schema: T) {
  const db = firestore();
  const documentPath: string = (
    documentPathOrRef instanceof URL
    ? ToDocumentPath(documentPathOrRef)
    : documentPathOrRef
  );
  const snap = await db.doc(documentPath).get();
  return z4.safeParse(schema, snap.data());
}

export async function getFirestoreDocument<T extends z4.$ZodType>(documentPathOrRef: string | DocumentReference, schema: T) {
  const db = firestore();
  const documentPath: string = (
    documentPathOrRef instanceof URL
    ? ToDocumentPath(documentPathOrRef)
    : documentPathOrRef
  );
  const snap = await db.doc(documentPath).get();
  return z4.parse(schema, snap.data());
}

async function* _getFirestoreDocumentsSafe<T extends z4.$ZodType>(documentPathsOrRefs: (string | DocumentReference)[], schema: T) {
  const settled = await Promise.allSettled(documentPathsOrRefs.map(pr => getFirestoreDocumentSafe(pr, schema)));

  for(const item of settled) {
    // Consistent with Util.populate: https://github.com/cougargrades/types/blob/966ce2211f5f44dc94fcfa897db5fe8eab31b278/src/Util.ts#L14
    if (item.status === 'fulfilled') {
      yield item.value
    }
  }
}

async function* _getFirestoreDocuments<T extends z4.$ZodType>(documentPathsOrRefs: (string | DocumentReference)[], schema: T) {
  const settled = await Promise.allSettled(documentPathsOrRefs.map(pr => getFirestoreDocument(pr, schema)));

  for(const item of settled) {
    // Consistent with Util.populate: https://github.com/cougargrades/types/blob/966ce2211f5f44dc94fcfa897db5fe8eab31b278/src/Util.ts#L14
    if (item.status === 'fulfilled') {
      yield item.value
    }
  }
}

export async function getFirestoreDocumentsSafe<T extends z4.$ZodType>(documentPathsOrRefs: (string | DocumentReference)[], schema: T) {
  return await Array.fromAsync(_getFirestoreDocumentsSafe(documentPathsOrRefs, schema))
}

export async function getFirestoreDocuments<T extends z4.$ZodType>(documentPathsOrRefs: (string | DocumentReference)[], schema: T) {
  return await Array.fromAsync(_getFirestoreDocuments(documentPathsOrRefs, schema))
}
