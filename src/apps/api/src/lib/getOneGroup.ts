import { Course, Group, IsDocumentReferenceArray, Section } from '@cougargrades/models'
import { PopulatedGroupResult, ToPopulatedGroupResult } from '@cougargrades/models/dto'
import { getFirestoreDocuments, getFirestoreDocumentSafe } from './firestore-config'
import { isNullish } from '@cougargrades/utils/nullish'

export async function getOneGroup(groupId: string, includeSections: boolean = false): Promise<PopulatedGroupResult | null> {
  const { data } = await getFirestoreDocumentSafe(`groups/${groupId}`, Group)
  if (isNullish(data)) return null;

  const settledData = await Promise.allSettled([
    (data && Array.isArray(data.courses) && IsDocumentReferenceArray(data.courses) ? getFirestoreDocuments(data.courses, Course) : Promise.resolve<Course[]>([])),
    (data && Array.isArray(data.relatedGroups) && IsDocumentReferenceArray(data.relatedGroups) ? getFirestoreDocuments(data.relatedGroups, Group) : Promise.resolve<Group[]>([])),
    (data && includeSections && Array.isArray(data?.sections) && IsDocumentReferenceArray(data.sections) ? getFirestoreDocuments(data.sections, Section) : Promise.resolve<Section[]>([])),
  ]);
  const [courseDataSettled, relatedGroupDataSettled, sectionDataSettled] = settledData
  const courseData = courseDataSettled.status === 'fulfilled' ? courseDataSettled.value : [];
  const relatedGroupData = relatedGroupDataSettled.status === 'fulfilled' ? relatedGroupDataSettled.value : [];
  const sectionData = sectionDataSettled.status === 'fulfilled' ? sectionDataSettled.value : [];

  const combinedData: Group = {
    ...data,
    courses: courseData
      .map(course => ({ 
        ...course,
        sections: [],
        instructors: [],
        relatedGroups: [],
        publications: [],
      }))
      // sort courses by total enrolled
      .toSorted((a,b) => b.enrollment.totalEnrolled - a.enrollment.totalEnrolled),
    sections: sectionData,
    relatedGroups: relatedGroupData,
  }

  return ToPopulatedGroupResult(combinedData);
}
