import { Course, Group, IsDocumentReferenceArray, Section } from '@cougargrades/models'
import { group2PopResult, PopulatedGroupResult } from '@cougargrades/models/dto'
import { getFirestoreDocuments, getFirestoreDocumentSafe } from './firestore-config'
import { isNullish } from '@cougargrades/utils/nullish'
import { descendingComparator } from '@cougargrades/utils/comparator'

export async function getOneGroup(groupId: string, includeSections: boolean = false): Promise<PopulatedGroupResult | null> {
  const { data } = await getFirestoreDocumentSafe(`groups/${groupId}`, Group)
  const didLoadCorrectly = data !== undefined && typeof data === 'object' && Object.keys(data).length > 1

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && IsDocumentReferenceArray(data.courses) ? getFirestoreDocuments(data.courses, Course) : Promise.resolve<Course[]>([])),
    (data && Array.isArray(data.relatedGroups) && IsDocumentReferenceArray(data.relatedGroups) ? getFirestoreDocuments(data.relatedGroups, Group) : Promise.resolve<Group[]>([])),
    (data && includeSections && Array.isArray(data?.sections) && IsDocumentReferenceArray(data.sections) ? getFirestoreDocuments(data.sections, Section) : Promise.resolve<Section[]>([])),
  ]);
  const [courseDataSettled, relatedGroupDataSettled, sectionDataSettled] = settledData
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const relatedGroupData = relatedGroupDataSettled.status === 'fulfilled' ? relatedGroupDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];

  if (!didLoadCorrectly) return null;

  const combinedData: Group = {
    ...data,
    relatedGroups: relatedGroupData
      // filter out undefined because there might be some empty references
      .filter(e => !isNullish(e))
      // sort related groups by identifier
      .sort((a,b) => descendingComparator(a, b, 'identifier'))
      // sanitize unwanted document references
      .map(group => ({
        ...group,
        sectionCount: group.sections.length,
        sections: [],
        courseCount: group.courses.length,
        courses: [],
        relatedGroups: [],
      })),
    courses: courseData
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
        publications: [],
      })),
    sections: sectionData
      // filter out undefined because there might be some empty references
      .filter(e => e !== undefined)
      // sanitize unwanted document references
      .map(sec => ({ 
        ...sec,
        instructors: [],
      })),
  }

  return group2PopResult(combinedData);
}
