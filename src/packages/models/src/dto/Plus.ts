import { z } from 'zod'
import { Section } from '../Section'
import { Course } from '../Course'

export type SectionPlus = z.infer<typeof SectionPlus>
export const SectionPlus = z.intersection(Section, z.object({
  id: z.string(),
  primaryInstructorName: z.string(),
  totalEnrolled: z.number().optional(),
}))

export type CoursePlus = z.infer<typeof CoursePlus>
export const CoursePlus = z.intersection(Course, z.object({
  id: z.string(),
  instructorCount: z.number(),
  sectionCount: z.number(),
  gradePointAverage: z.number(),
  standardDeviation: z.number(),
  dropRate: z.number(),
  totalEnrolled: z.number(),
  classSize: z.number(),
}))
