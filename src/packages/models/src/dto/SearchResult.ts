
import { z } from 'zod'
import { getBadges, SearchResultBadge } from './Badges';
import { Course } from '../Course';
import { Instructor } from '../Instructor';
import { Group } from '../Group';

export type SearchResultType = z.infer<typeof SearchResultType>
export const SearchResultType = z.enum(['course', 'instructor', 'group']);

export type SearchResult = z.infer<typeof SearchResult>;
export const SearchResult = z.object({
  /**
   * used for react, same as document path
   */
  key: z.string(),
  /**
   * where to redirect the user when selected
   */
  href: z.string(),
  type: SearchResultType,
  /**
   * What to display in the <li> divider in the search results
   */
  group: z.string(),
  /**
   *  What the result is
   */
  title: z.string(),
  badges: SearchResultBadge.array(),
})

export function course2SearchResult(data: Course): SearchResult {
  return {
    key: data._path,
    href: `/c/${data._id}`,
    type: 'course',
    group: '📚 Courses',
    title: `${data._id}: ${data.description}`,
    badges: getBadges(data.GPA, data.enrollment),
  };
}

export function instructor2SearchResult(data: Instructor): SearchResult {
  return {
    key: data._path,
    href: `/i/${data._id}`,
    type: 'instructor',
    group: '👩‍🏫 Instructors',
    title: data._id,
    badges: getBadges(data.GPA, data.enrollment),
  };
}

export function group2SearchResult(data: Group): SearchResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    type: 'group',
    group: '🗃️ Groups',
    title: `${data.name}`,
    badges: [],
  };
}
