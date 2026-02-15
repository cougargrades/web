
import { z } from 'zod'
import { SparklineData } from './SparklineData'
import { Enrollment } from './Enrollment'
import { GPA } from './GPA'
import { DocumentReference } from './DocumentReference'
import { Course } from './Course'
import { Section } from './Section'

export type Instructor = z.infer<typeof Instructor>
export const Instructor = z.object({
  _id: z.string(),
  _path: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  departments: z.partialRecord(z.string(), z.number()),
  firstTaught: z.number(),
  lastTaught: z.number(),
  keywords: z.string().array(),
  get courses() {
    return z.union([ DocumentReference.array(), Course.array() ])
  },
  get sections() {
    return z.union([ DocumentReference.array(), Section.array() ])
  },
  GPA: GPA,
  enrollment: Enrollment,
  rmpLegacyId: z.string().nullish(),
  enrollmentSparklineData: SparklineData.nullish(),
})

