
import type { FaqPostData } from './faq'

export const POPULAR_TABS: FaqPostData[] = [
  {
    id: 1,
    slug: 'enrolled-courses',
    title: 'Top Enrolled Courses',
    content: 'The most enrolled Courses at the University of Houston.',
  },
  {
    id: 2,
    slug: 'viewed-courses',
    title: 'Most Viewed Courses',
    content: 'The Courses which are most often viewed on CougarGrades. Before CougarGrades 2.0.0 (March 3rd 2026), these results were powered by Google Analytics. Any data recorded from before then may be inconsistent.',
  },
  {
    id: 3,
    slug: 'enrolled-instructors',
    title: 'Top Enrolled Instructors',
    content: 'The most enrolled Instructors at the University of Houston.',
  },
  {
    id: 4,
    slug: 'viewed-instructors',
    title: 'Most Viewed Instructors',
    content: 'The Instructors which are most often viewed on CougarGrades. Before CougarGrades 2.0.0 (March 3rd 2026), these results were powered by Google Analytics. Any data recorded from before then may be inconsistent.',
  },
];
