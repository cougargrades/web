
import { z } from 'zod'
import { descendingComparator } from '@cougargrades/utils/comparator'

import { DocumentReference, IsDocumentReferenceArray } from '../DocumentReference'
import { LabeledLink } from '../Course'
import { Group } from '../Group'
import { course2CoursePlus, CoursePlus } from './Plus'
import { Section } from '../Section'

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

// export type LiteGroupResult2 = z.infer<typeof LiteGroupResult2>
// export const LiteGroupResult2 = Group.omit({ courses: true, sections: true, relatedGroups: true }).extend({
//   href: z.string(),
//   courseCount: z.number(),
//   sectionCount: z.number(),
//   get relatedGroups() {
//     return LiteGroupResult2.array()
//   },
// })

// export function ToLiteGroupResult({ courses, sections, relatedGroups, ...group }: Group): LiteGroupResult2 {
//   return {
//     ...group,
//     href: `/g/${group.identifier}`,
//     courseCount: courses.length,
//     sectionCount: sections.length,
//     relatedGroups: IsDocumentReferenceArray(relatedGroups) ? [] : relatedGroups.map(g => ToLiteGroupResult(g))
//   }
// }

// export type GroupResult = z.infer<typeof GroupResult>
// export const GroupResult = LiteGroupResult.extend({
//   courses: DocumentReference.array(),
//   sections: DocumentReference.array(),
// })

export type PopulatedGroupResult = z.infer<typeof PopulatedGroupResult>
export const PopulatedGroupResult = LiteGroupResult.extend({
  courses: CoursePlus.array(),
  sections: Section.array(),
  relatedGroups: LabeledLink.array(),
})

export type AllGroupsResult = z.infer<typeof AllGroupsResult>
export const AllGroupsResult = z.object({
  categories: z.string().array(),
  core_curriculum: LiteGroupResult.array(),
  all_groups: LiteGroupResult.array(),
})


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

export function group2PopResult(data: Group): PopulatedGroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: data.name,
    description: data.description,
    categories: Array.isArray(data.categories) ? data.categories : [],
    courses: IsDocumentReferenceArray(data.courses) ? [] : data.courses.map(e => course2CoursePlus(e)),
    courseCount: data.courses.length,
    sections: !IsDocumentReferenceArray(data.sections) ? data.sections : [],
    sectionCount: data.sections.length,
    relatedGroups: !IsDocumentReferenceArray(data.relatedGroups) ? data.relatedGroups.map(group => ({
      title: group.name,
      tooltip: group.description,
      url: `/g/${group.identifier}`,
    })) : [],
    sources: Array.isArray(data.sources) ? data.sources.sort((a, b) => descendingComparator(a, b, 'title')).slice(0, 3) : [],
  }
}

