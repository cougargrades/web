import { z } from 'zod'
import { Section } from '../Section'
import { Course, CourseThin } from '../Course'
import { Instructor, InstructorThin } from '../Instructor'

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
  dropRate: z.number().nullable(),
  totalEnrolled: z.number().nullable(),
  classSize: z.number().nullable(),
})

export type PlusMetrics = z.infer<typeof PlusMetrics>
export const PlusMetrics = z.object({
  activeUsers: z.number().optional(),
  screenPageViews: z.number().optional(),
})

export type CoursePlusMetrics = z.infer<typeof CoursePlusMetrics>
//export const CoursePlusMetrics = z.intersection(CourseThin, PlusMetrics)
export const CoursePlusMetrics = z.intersection(Course, PlusMetrics)

export type InstructorPlusMetrics = z.infer<typeof InstructorPlusMetrics>
//export const InstructorPlusMetrics = z.intersection(InstructorThin, PlusMetrics)
export const InstructorPlusMetrics = z.intersection(Instructor, PlusMetrics)

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
    dropRate: course.enrollment !== undefined ? (course.enrollment.totalW/course.enrollment.totalEnrolled*100) : null,
    totalEnrolled: course.enrollment !== undefined ? course.enrollment.totalEnrolled : null,
    classSize: course.enrollment !== undefined && Array.isArray(course.sections) ? (course.enrollment.totalEnrolled / course.sections.length) : null,
  }
}
