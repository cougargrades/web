
import { z } from 'zod'
import { descendingComparator } from '@cougargrades/utils/comparator'

import { IsDocumentReferenceArray } from '../DocumentReference'
import { Group } from '../Group'
import { course2CoursePlus, CoursePlus } from './Plus'
import { Section } from '../Section'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish'

export type LiteGroupResult = z.infer<typeof LiteGroupResult>
export const LiteGroupResult = Group.omit({ courses: true, sections: true, relatedGroups: true, }).extend({
  href: z.string(),
  courseCount: z.number(),
  sectionCount: z.number(),
  get relatedGroups() {
    return LiteGroupResult.array()
  },
})

export function ToLiteGroupResult({ courses, sections, relatedGroups, ...group }: Group): LiteGroupResult {
  return {
    ...group,
    href: `/g/${group.identifier}`,
    courseCount: courses.length,
    sectionCount: sections.length,
    relatedGroups: IsDocumentReferenceArray(relatedGroups) ? [] : relatedGroups.map(g => ToLiteGroupResult(g)),
    sources: group.sources.toSorted((a, b) => descendingComparator(a, b, 'title')),
  }
}

export type PopulatedGroupResult = z.infer<typeof PopulatedGroupResult>
export const PopulatedGroupResult = LiteGroupResult.extend({
  courses: CoursePlus.array(),
  sections: Section.array(),
})

export function ToPopulatedGroupResult(data: Group): PopulatedGroupResult {
  const lite = ToLiteGroupResult(data);
  return {
    ...lite,
    courses: IsDocumentReferenceArray(data.courses) ? [] : data.courses.map(e => course2CoursePlus(e)),
    sections: IsDocumentReferenceArray(data.sections) ? [] : data.sections,
  }
}

/**
 * Defaults to `default` if no `#layout:LayoutName` can be found
 * @param categories 
 * @returns 
 */
export function GetGroupLayoutFromCategories(categories: string[]): string {
  const layoutCategory = categories.find(cat => cat.startsWith('#layout:'));
  if (isNullish(layoutCategory)) return 'default';
  const layout = layoutCategory.substring('#layout:'.length);
  if (isNullishOrWhitespace(layout)) return 'default';
  return layout;
}

