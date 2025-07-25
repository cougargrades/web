import { FaqPostData } from './faq';

export type { TopOptions, TopMetric, TopTopic, TopLimit, TopTime } from './data/back/getTopResults'

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
    content: 'The Courses which are most often viewed on CougarGrades. These results are powered by Google Analytics, so please interpret the results with a grain of salt.',
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
    content: 'The Instructors which are most often viewed on CougarGrades. These results are powered by Google Analytics, so please interpret the results with a grain of salt.',
  },
];
