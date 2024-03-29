import { Group } from '@cougargrades/types'
import { defaultComparator } from '../../../components/datatable'
import { firebase } from '../../firebase_admin'
import { AllGroupsResult, AllGroupsResultItem, ALL_GROUPS_SENTINEL, group2Result } from '../useAllGroups'

export async function getAllGroups(): Promise<AllGroupsResult> {
  const db = firebase.firestore()
  const query = db.collection('groups').where('categories', 'array-contains', '#ShowInSidebar')
  const querySnap = await query.get()
  const data: Group[] = querySnap.docs.filter(e => e.exists).map(e => e.data() as Group);
  
  // sanitize output
  for(let i = 0; i < data.length; i++) {
    data[i].courses = []
    data[i].sections = []
    data[i].relatedGroups = []
  }

  // make categories, necessary for sorting "correctly"
  const categories = [
    ...(
      Array.from(new Set(data.map(e => Array.isArray(e.categories) ? e.categories.filter(cat => !cat.startsWith('#')) : []).flat()))
        .sort((a,b) => defaultComparator(a,b)) // [ '(All)', '(2022-2023)', '(2021-2022)', '(2020-2021)' ]
      ),
    //ALL_GROUPS_SENTINEL
  ];

  const results = categories.map(cat => data.filter(e => Array.isArray(e.categories) && e.categories.includes(cat)).map(e => group2Result(e))).flat()

  // // make a key/value store of category -> GroupResult[]
  // const results = categories
  //   .reduce((obj, key) => {
  //     if(key === ALL_GROUPS_SENTINEL) {
  //       // obj[key] = [
  //       //   ...(status === 'success' ? data.filter(e => Array.isArray(e.categories) && e.categories.length === 0).map(e => group2Result(e)) : [])
  //       // ];
  //     }
  //     else {
  //       obj[key] = [
  //         ...(data.filter(e => Array.isArray(e.categories) && e.categories.includes(key)).map(e => group2Result(e)))
  //       ];
  //     }
  //     return obj;
  //   }, {} as AllGroupsResultItem);

  return {
    categories,
    //results,
    core_curriculum: [
      ...results
    ],
    all_groups: [
      ...(data.filter(e => Array.isArray(e.categories) && ! e.categories.includes('#ShowInSidebar')).map(e => group2Result(e)))
    ],
  }
}
