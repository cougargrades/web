
import { z } from 'zod'
import { GPA } from './GPA'
import { Enrollment } from './Enrollment'
import { SparklineData } from './SparklineData'
import { DocumentReference } from './DocumentReference'
import { Section } from './Section'
import { Instructor } from './Instructor'
import { Group } from './Group'

export type LabeledLink = z.infer<typeof LabeledLink>
export const LabeledLink = z.object({
  title: z.string(),
  tooltip: z.string().nullish(),
  url: z.string(),
})

export type PublicationInfo = z.infer<typeof PublicationInfo>
export const PublicationInfo = z.intersection(LabeledLink, z.object({
  catoid: z.string(),
  coid: z.string(),
  classification: z.enum(['undergraduate', 'graduate']),
  scrapeDate: z.string(),
  content: z.string(),
}))

export type TCCNSUpdateInfo = z.infer<typeof TCCNSUpdateInfo>
export const TCCNSUpdateInfo = z.object({
  shortMessage: z.string(),
  longMessage: z.string(),
  courseHref: z.string(),
  sourceHref: z.string(),
  isSourceReliable: z.boolean(),
})


export type Course = z.infer<typeof Course>
export const Course = z.object({
  _id: z.string(),
  _path: z.string(),
  department: z.string(),
  catalogNumber: z.string(),
  description: z.string(),
  GPA: GPA,
  get sections() {
    return z.union([ DocumentReference.array(), Section.array() ])
  },
  get instructors() {
    return z.union([ DocumentReference.array(), Instructor.array() ])
  },
  get groups() {
    return z.union([ DocumentReference.array(), Group.array() ])
  },
  keywords: z.string().array(),
  firstTaught: z.number(),
  lastTaught: z.number(),
  enrollment: Enrollment,
  publications: PublicationInfo.array(),
  tccnsUpdates: TCCNSUpdateInfo.array(),
  enrollmentSparklineData: SparklineData.nullish(),
})
