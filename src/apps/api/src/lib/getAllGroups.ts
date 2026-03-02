
import { z } from 'zod'
import { Group, metaFakeGroupDescription } from '@cougargrades/models'
import { AllGroupsResult, group2Result, LiteGroupResult } from '@cougargrades/models/dto';
import { defaultComparator } from '@cougargrades/utils/comparator';
import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import counts from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/counts.json'
import { firestore } from './firestore-config'

export const FAKE_GROUPS: Group[] = [
  ...curated_colleges.filter(college => !['college-exploratory'].includes(college.identifier)).map<Group>(college => ({
    identifier: college.identifier,
    name: college.groupLongTitle,
    shortName: college.groupShortTitle,
    description: metaFakeGroupDescription(college.identifier, false),
    courses: [],
    sections: [],
    relatedGroups: [],
    categories: ['Colleges/Schools', '#ShowInSidebar'],
    sources: [],
  })),
  {
    name: 'All Subjects',
    identifier: 'all-subjects',
    description: `Every Subject available at the University of Houston. ${counts.num_subjects} Subjects in total.`,
    courses: [],
    sections: [],
    relatedGroups: [],
    categories: ['Other Groups', '#ShowInSidebar'],
    sources: [],
  }
]

// TODO: actually return LiteGroupResult[]

export async function getAllGroups(): Promise<AllGroupsResult> {
  const db = firestore()
  const query = db.collection('groups').where('categories', 'array-contains', '#ShowInSidebar');
  const snap = await query.get()
  const data = Group.array().parse(
    snap.docs
      .filter(e => e.exists)
      .map(e => e.data())
  )
  
  // sanitize output
  for(let i = 0; i < data.length; i++) {
    data[i].courses = []
    data[i].sections = []
    data[i].relatedGroups = []
  }

  const allPublicCategoriesSorted = Array.from(
    new Set(
      data
        .map(g => 
          g.categories.filter(cat => !cat.startsWith('#'))
        )
        .flat()
    )
  ).sort((a,b) => defaultComparator(a,b))

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

