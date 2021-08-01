import { Group } from '@cougargrades/types'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { Observable } from './Observable'

export interface GroupResultCategory {
  key: string;
  title: string;
  href?: string;
}

export interface GroupResult {
  categories: GroupResultCategory[];
}

export function useGroupData(groupId: string): Observable<GroupResult> {
  const db = useFirestore()
  const { data, error, status } = useFirestoreDocData<Group>(db.doc(`/groups/${groupId}`))
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const isBadObject = typeof data === 'object' && Object.keys(data).length === 1
  const isActualError = typeof groupId === 'string' && groupId !== '' && status !== 'loading' && isBadObject

  return {
    data: {
      categories: [
        ...(didLoadCorrectly ? Array.isArray(data.categories) ? data.categories.map(e => e === 'UH Core Curriculum' ? { key: e, title: e, href: '/groups' } : { key: e, title: e }) : [] : [])
      ]
    },
    status,
    error,
  }
}


