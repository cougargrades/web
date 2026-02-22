import { z } from 'zod'
import { Section } from '../Section'
import { Course } from '../Course'

export type SectionPlus = z.infer<typeof SectionPlus>
export const SectionPlus = Section.extend({
  id: z.string(),
  primaryInstructorName: z.string(),
  totalEnrolled: z.number().optional(),
})

export type CoursePlus = z.infer<typeof CoursePlus>
export const CoursePlus = Course.extend({
  id: z.string(),
  instructorCount: z.number(),
  sectionCount: z.number(),
  gradePointAverage: z.number(),
  standardDeviation: z.number(),
  dropRate: z.number(),
  totalEnrolled: z.number(),
  classSize: z.number(),
})

export function course2CoursePlus(course: Course): CoursePlus {
  return {
    ...course,
    id: course._id,
    instructorCount: Array.isArray(course.instructors) ? course.instructors.length : 0,
    instructors: [],
    sectionCount: Array.isArray(course.sections) ? course.sections.length : 0,
    sections: [],
    groups: [],
    gradePointAverage: course.GPA.average,
    standardDeviation: course.GPA.standardDeviation,
    dropRate: course.enrollment !== undefined ? (course.enrollment.totalW/course.enrollment.totalEnrolled*100) : NaN,
    totalEnrolled: course.enrollment !== undefined ? course.enrollment.totalEnrolled : NaN,
    classSize: course.enrollment !== undefined && Array.isArray(course.sections) ? (course.enrollment.totalEnrolled / course.sections.length) : NaN,
  }
}
