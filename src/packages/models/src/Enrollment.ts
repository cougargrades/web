
import { z } from 'zod'

export type Enrollment = z.infer<typeof Enrollment>
export const Enrollment = z.object({
  totalA: z.number(),
  totalB: z.number(),
  totalC: z.number(),
  totalD: z.number(),
  totalF: z.number(),
  totalS: z.number(),
  totalNCR: z.number(),
  totalW: z.number(),
  totalEnrolled: z.number(),
})
