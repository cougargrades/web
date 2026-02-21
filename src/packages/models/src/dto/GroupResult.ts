
import { z } from 'zod'
import { descendingComparator } from '@cougargrades/utils/comparator'

import { DocumentReference } from '../DocumentReference'
import { LabeledLink } from '../Course'
import { Group } from '../Group'

export type LiteGroupResult = z.infer<typeof LiteGroupResult>
/**
 * This is the "light" GroupResult
 */
export const LiteGroupResult = z.object({
  key: z.string(),
  href: z.string(),
  title: z.string(),
  description: z.string(),
  categories: z.string().array(),
  courseCount: z.number(),
  sectionCount: z.number(),
  sources: LabeledLink.array(),
})

export type GroupResult = z.infer<typeof GroupResult>
export const GroupResult = LiteGroupResult.extend({
  courses: DocumentReference.array(),
  sections: DocumentReference.array(),
})

// export type PopulatedGroupResult = z.infer<typeof PopulatedGroupResult>
// export const PopulatedGroupResult = GroupResult.extend({
//   courses: CoursePlus.array(),
//   sections: Section.array(),
//   relatedGroups: LabeledLink.array(),
// })

export function group2Result(data: Group): LiteGroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: data.name,
    description: data.description,
    categories: Array.isArray(data.categories) ? data.categories : [],
    courseCount: data.courses.length,
    sectionCount: data.sections.length,
    // courses: IsDocumentReferenceArray(data.courses) ? data.courses : data.courses.map(e => ToDocumentReference(e._path)),
    // sections: IsDocumentReferenceArray(data.sections) ? data.sections : data.sections.map(e => ToDocumentReference(e._path)),
    sources: Array.isArray(data.sources) ? data.sources.sort((a,b) => descendingComparator(a, b, 'title')).slice(0,3) : []
  }
}

// export function group2PopResult(data: Group): PopulatedGroupResult {
//   return {
//     key: data.identifier,
//     href: `/g/${data.identifier}`,
//     title: data.name,
//     description: data.description,
//     categories: Array.isArray(data.categories) ? data.categories : [],
//     courses: data.courses,
//     //courseCount: data.courseCount,
//     sections: data.sections,
//     //sectionCount: data.sectionCount,
//     relatedGroups: !IsDocumentReferenceArray(data.relatedGroups) ? data.relatedGroups.map(group => ({
//       title: group.name,
//       tooltip: group.description,
//       url: `/g/${group.identifier}`,
//     })) : [],
//     sources: Array.isArray(data.sources) ? data.sources.sort((a,b) => descendingComparator(a, b, 'title')).slice(0,3) : []
//   }
// }


