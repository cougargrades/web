
import { z } from 'zod'
import { Group } from '@cougargrades/models'
import { LiteGroupResult, ToLiteGroupResult } from '@cougargrades/models/dto';
import { firestore } from './firestore-config'

export async function getAllGroups(): Promise<LiteGroupResult[]> {
  const db = firestore()
  const query = db.collection('groups').where('categories', 'array-contains', '#ShowInSidebar');
  const snap = await query.get()
  const data = Group.array().parse(
    snap.docs
      .filter(e => e.exists)
      .map(e => e.data())
  )

  const results = data.map(g => ToLiteGroupResult(g));
  return results;
}

