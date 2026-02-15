
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
  get course() {
    return z.union([ DocumentReference, Course ])
  }
})
