import { Section, Util } from '@cougargrades/types';
import { CoursePlus, group2PopResult, GroupPlus, PopulatedGroupResult } from '../useAllGroups';
import { getFirestoreDocument } from './getFirestoreData';

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
