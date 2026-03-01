
import { z } from 'zod'
import { DocumentReference, IsDocumentReference, ToDocumentPath } from './DocumentReference';
import { Instructor } from './Instructor';
import { Course } from './Course';

export type InstructorNames = z.infer<typeof InstructorNames>;
export const InstructorNames = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export type Section = z.infer<typeof Section>;
export const Section = z.object({
  _id: z.string(),
  _path: z.string(),
  courseName: z.string(),
  instructorNames: InstructorNames.array(),
  get instructors() {
    return z.union([ DocumentReference.array(), Instructor.array() ])
  },
  sectionNumber: z.number(),
  term: z.number(),
  termString: z.string(),
  A: z.number(),
  B: z.number(),
  C: z.number(),
  D: z.number(),
  F: z.number(),
  W: z.number(),
  S: z.number(),
  NCR: z.number(),
  semesterGPA: z.number().nullable(),
  /**
   * Apparently, we never actually initialized this field with real data.
   * 
   * See:
   * - https://github.com/cougargrades/types/blob/966ce2211f5f44dc94fcfa897db5fe8eab31b278/src/GradeDistributionCSVRow.ts#L83
   * - https://github.com/cougargrades/publicdata/blob/4ef72d43e0fdf7e46c00db5c1e0e48fd99cadba0/mock-database/src/_mockDatabase.ts#L133
   */
  // get course() {
  //   return z.union([ DocumentReference, Course ])
  // }
})

export type SectionThin = z.infer<typeof SectionThin>
export const SectionThin = Section.omit({ instructors: true })

export const GetTotalEnrolled = (sec: Section) => sec.A + sec.B + sec.C + sec.D + sec.F + sec.NCR + sec.S + sec.W;

/**
 * Based on the input (Section[]), return a Map where:
 * - the Key is the "courseName"
 * - the Value is the count of sections within the input that were for this course
 * @param sections 
 */
export function GetSectionCountByCourse(sections: Section[]): Map<string, number> {
  const result = new Map<string, number>();
  for(let item of sections) {
    const existingValue = result.get(item.courseName) ?? 0;
    result.set(item.courseName, existingValue + 1);
  }
  return result;
}

/**
 * Based on the input (Section[]), return a Map where:
 * - the Key is the "courseName"
 * - the Value is the sum of the `GetTotalEnrolled(section)` within the input that were for this course
 * @param sections 
 */
export function GetEnrolledCountByCourse(sections: Section[]): Map<string, number> {
  const result = new Map<string, number>();
  for(let item of sections) {
    const existingValue = result.get(item.courseName) ?? 0;
    const totalEnrolled = GetTotalEnrolled(item);
    result.set(item.courseName, existingValue + totalEnrolled);
  }
  return result;
}

/**
 * Based on the input (Section[]), return a Map where:
 * - the Key is the "instructorName" (both values in `Section.instructorNames` are incremented)
 * - the Value is the count of sections within the input that were for this course
 * @param sections 
 */
export function GetSectionCountByInstructor(sections: Section[]): Map<string, number> {
  const result = new Map<string, number>();
  for(let item of sections) {
    for (let instr of item.instructors) {
      let instrID;
      if (IsDocumentReference(instr)) {
        const [collectionId, documentID] = ToDocumentPath(instr).split('/')
        instrID = documentID;
      }
      else {
        instrID = instr._id;
      }
      const existingValue = result.get(instrID) ?? 0;
      result.set(instrID, existingValue + 1);
    }
  }
  return result;
}

/**
 * Based on the input (Section[]), return a Map where:
 * - the Key is the "instructorName" (both values in `Section.instructorNames` are incremented)
 * - the Value is the sum of the `GetTotalEnrolled(section)` within the input that were for this course
 * @param sections 
 */
export function GetEnrolledCountByInstructor(sections: Section[]): Map<string, number> {
  const result = new Map<string, number>();
  for(let item of sections) {
    for (let instr of item.instructors) {
      let instrID;
      if (IsDocumentReference(instr)) {
        const [collectionId, documentID] = ToDocumentPath(instr).split('/')
        instrID = documentID;
      }
      else {
        instrID = instr._id;
      }
      const existingValue = result.get(instrID) ?? 0;
      const totalEnrolled = GetTotalEnrolled(item);
      result.set(instrID, existingValue + totalEnrolled);
    }
  }
  return result;
}
