import { Course, Group, LabeledLink, Section, Util } from '@cougargrades/types'
import { DocumentReference } from '@cougargrades/types/dist/FirestoreStubs'
import { CourseInstructorResult } from './useCourseData'
import { getBadges } from './getBadges'
import { defaultComparator, descendingComparator } from '../../components/datatable'
import { isDocumentReferenceArray } from '@cougargrades/types/dist/Util'

export type AllGroupsResultItem = { [key: string]: GroupResult[] };

export interface AllGroupsResult {
  categories: string[];
  //results: AllGroupsResultItem;
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
  sources: LabeledLink[];
}

export interface PopulatedGroupResult {
  key: string;
  href: string;
  title: string;
  description: string;
  categories: string[];
  courses: CoursePlus[];
  courseCount?: number;
  sections: Section[];
  sectionCount?: number;
  relatedGroups: LabeledLink[];
  sources: LabeledLink[];
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
    sources: Array.isArray(data.sources) ? data.sources.sort((a,b) => descendingComparator(a, b, 'title')).slice(0,3) : []
  }
}

export function group2PopResult(data: GroupPlus): PopulatedGroupResult {
  return {
    key: data.identifier,
    href: `/g/${data.identifier}`,
    title: data.name,
    description: data.description,
    categories: Array.isArray(data.categories) ? data.categories : [],
    courses: data.courses as CoursePlus[],
    courseCount: data.courseCount,
    sections: data.sections as Section[],
    sectionCount: data.sectionCount,
    relatedGroups: Array.isArray(data.relatedGroups) && !isDocumentReferenceArray(data.relatedGroups) ? data.relatedGroups.map(group => ({
      title: group.name,
      tooltip: group.description,
      url: `/g/${group.identifier}`,
    })) : [],
    sources: Array.isArray(data.sources) ? data.sources.sort((a,b) => descendingComparator(a, b, 'title')).slice(0,3) : []
  }
}

export function course2Result(data: CoursePlus): CourseInstructorResult {
  const numInstructors: number = data.instructorCount !== undefined ? data.instructorCount : Array.isArray(data.instructors) ? data.instructors.length : 0;
  const numSections: number = data.sectionCount !== undefined ? data.sectionCount : Array.isArray(data.sections) ? data.sections.length : 0;
  return {
    key: data._path,
    href: `/c/${data._id}`,
    title: `${data.department} ${data.catalogNumber}`,
    subtitle: data.description,
    caption: `${numInstructors} instructors • ${numSections} sections`,
    badges: getBadges(data.GPA, data.enrollment),
    id: data._id,
    lastInitial: '',
  };
}

export const ALL_GROUPS_SENTINEL = 'All Groups'

export interface GroupPlus extends Group {
  courseCount?: number;
  sectionCount?: number;
}

export interface CoursePlus extends Course {
  sectionCount?: number;
  instructorCount?: number;
}


