import { Course, Group, LabeledLink, Section, Util } from '@cougargrades/types'
import { DocumentReference } from '@cougargrades/types/dist/FirestoreStubs'
import { CourseInstructorResult } from './useCourseData'
import { getBadges } from './getBadges'
import { defaultComparator, descendingComparator } from '../../components/datatable'
import { firebaseApp, getFirestoreDocument } from '../ssg'

type AllGroupsResultItem = { [key: string]: GroupResult[] };

export interface AllGroupsResult {
  categories: string[];
  results: AllGroupsResultItem;
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

export async function getAllGroups(): Promise<AllGroupsResult> {
  const db = firebaseApp.firestore()
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

export interface GroupPlus extends Group {
  courseCount?: number;
  sectionCount?: number;
}

export interface CoursePlus extends Course {
  sectionCount?: number;
  instructorCount?: number;
}

export async function getOneGroup(groupId: string, includeSections: boolean = false): Promise<PopulatedGroupResult | undefined> {
  const data = await getFirestoreDocument<GroupPlus>(`/groups/${groupId}`)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && Util.isDocumentReferenceArray(data.courses) ? Util.populate<CoursePlus>(data.courses) : Promise.resolve<CoursePlus[]>([])),
    (data && includeSections && Array.isArray(data?.sections) && Util.isDocumentReferenceArray(data.sections) ? Util.populate<Section>(data.sections, 10, true) : Promise.resolve<Section[]>([])),
  ]);
  const [courseDataSettled, sectionDataSettled] = settledData
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];

  if (didLoadCorrectly) {
    data.keywords = []
    data.courseCount = Array.isArray(data.courses) ? data.courses.length : 0
    data.courses = courseData
      // filter out undefined because there might be some empty references
      .filter(e => e !== undefined)
      // sort courses by total enrolled
      .sort((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled)
      // sanitize unwanted document references
      .map(course => ({ 
        ...course,
        // property necessary for some client-side calculations
        sectionCount: Array.isArray(course.sections) ? course.sections.length : 0,
        sections: [],
        instructorCount: Array.isArray(course.instructors) ? course.instructors.length : 0,
        instructors: [],
        // property not needed
        //sections: Array.isArray(course.sections) ? course.sections.map(sec => ({ id: sec?.id as any as string })) as any : [],
        //instructors: Array.isArray(course.instructors) ? course.instructors.map(ins => ({ id: ins?.id as any as string })) as any : [],
        groups: [],
        keywords: [],
      }));
    data.sectionCount = Array.isArray(data.sections) ? data.sections.length : 0
    data.sections = sectionData
      // filter out undefined because there might be some empty references
      .filter(e => e !== undefined)
      // sanitize unwanted document references
      .map(sec => ({ 
        ...sec,
        instructors: [],
      }));
  }

  return didLoadCorrectly ? group2PopResult(data) : undefined
}
