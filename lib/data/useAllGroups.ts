import { useFirestore, useFirestoreCollectionData, useFirestoreDoc } from 'reactfire'
import { Course, Group, Section } from '@cougargrades/types'
import { DocumentReference } from '@cougargrades/types/dist/FirestoreStubs'
import { Observable } from './Observable'
import { CourseInstructorResult } from './useCourseData';
import { getBadges } from './getBadges'
import { useFakeFirestore } from '../firebase'

type AllGroupsResultItem = { [key: string]: GroupResult[] };

export interface AllGroupsResult {
  categories: string[];
  results: AllGroupsResultItem;
  core_curriculum: GroupResult[];
  all_groups: GroupResult[];
}

export interface GroupResult {
  key: string;
  href: string;
  title: string;
  description: string;
  categories: string[];
  courses: DocumentReference<Course>[];
  sections: DocumentReference<Section>[];
}

export function group2Result(data: Group): GroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: data.name,
    description: data.description,
    categories: Array.isArray(data.categories) ? data.categories : [],
    courses: data.courses as DocumentReference<Course>[],
    sections: data.sections as DocumentReference<Section>[],
  }
}

export function course2Result(data: Course): CourseInstructorResult {
  return {
    key: data._path,
    href: `/c/${data._id}`,
    title: `${data.department} ${data.catalogNumber}`,
    subtitle: data.description,
    caption: `${Array.isArray(data.instructors) ? data.instructors.length : 0} instructors • ${Array.isArray(data.sections) ? data.sections.length : 0} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    lastInitial: '',
  };
}

export function useAllGroups(): Observable<AllGroupsResult> {
  const db = useFakeFirestore();
  const query = (db.collection('groups') as any).where('categories', 'array-contains', 'UH Core Curriculum') // TODO: remove filter once testing is done
  const { data, status, error } = useFirestoreCollectionData<Group>(query)

  const ALL_GROUPS_SENTINEL = 'All Groups'

  const categories = [
    ...(status === 'success' ? Array.from(new Set(data.map(e => Array.isArray(e.categories) ? e.categories : []).flat())) : []),
    //ALL_GROUPS_SENTINEL
  ];

  // make a key/value store of category -> GroupResult[]
  const results = categories
  .reduce((obj, key) => {
    if(key === ALL_GROUPS_SENTINEL) {
      // obj[key] = [
      //   ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && e.categories.length === 0).map(e => group2Result(e)) : [])
      // ];
    }
    else {
      obj[key] = [
        ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && e.categories.includes(key)).map(e => group2Result(e)) : [])
      ];
    }
    return obj;
  }, {} as AllGroupsResultItem);

  return {
    data: {
      categories,
      results,
      core_curriculum: [
        ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)) : [])
      ],
      all_groups: [
        ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && ! e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)) : [])
      ],
    },
    error,
    status,
  }
}

export function useOneGroup(groupId: string): Observable<GroupResult> {
  const db = useFakeFirestore();
  const { data, status, error } = useFirestoreDoc<Group>(db.doc(`/groups/${groupId}`) as any)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1
  const isBadObject = typeof data === 'object' && Object.keys(data).length === 1
  const isActualError = typeof groupId === 'string' && groupId !== '' && status !== 'loading' && isBadObject
  const good = status === 'success' && didLoadCorrectly && !isActualError && data.exists;

  return {
    data: good ? group2Result(data.data()) : undefined,
    error,
    status,
  }
}
