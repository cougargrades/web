
import { z } from 'zod'
import { DocumentReference } from './DocumentReference';
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
