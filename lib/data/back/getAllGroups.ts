import { Group } from '@cougargrades/types'
import { defaultComparator } from '../../../components/datatable'
import { firebase } from '../../firebase_admin'
import { AllGroupsResult, AllGroupsResultItem, ALL_GROUPS_SENTINEL, group2Result } from '../useAllGroups'

export async function getAllGroups(): Promise<AllGroupsResult> {
  const db = firebase.firestore()
  const query = db.collection('groups').where('categories', 'array-contains', '#UHCoreCurriculum')
  const querySnap = await query.get()
  const data: Group[] = querySnap.docs.filter(e => e.exists).map(e => e.data() as Group);
  
  // sanitize output
  for(let i = 0; i < data.length; i++) {
    data[i].courses = []
    data[i].sections = []
  }

  // make categories
  const categories = [
    ...(
      Array.from(new Set(data.map(e => Array.isArray(e.categories) ? e.categories.filter(cat => !cat.startsWith('#')) : []).flat()))
        .sort((a,b) => defaultComparator(a,b)) // [ '(All)', '(2022-2023)', '(2021-2022)', '(2020-2021)' ]
        .slice(0,2) // don't endlessly list the groups, they're still accessible from a course directly
      ),
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
          ...(data.filter(e => Array.isArray(e.categories) && e.categories.includes(key)).map(e => group2Result(e)))
        ];
      }
      return obj;
    }, {} as AllGroupsResultItem);

  return {
    categories,
    results,
    core_curriculum: [
      ...(data.filter(e => Array.isArray(e.categories) && e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)))
    ],
    all_groups: [
      ...(data.filter(e => Array.isArray(e.categories) && ! e.categories.includes('UH Core Curriculum')).map(e => group2Result(e)))
    ],
  }
}
