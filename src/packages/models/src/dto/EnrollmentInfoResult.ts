
import { z } from 'zod'


export type EnrollmentInfoResult = z.infer<typeof EnrollmentInfoResult>
export const EnrollmentInfoResult = z.object({
  key: z.union([z.string(), z.number(), z.symbol()]),
  title: z.string(),
  color: z.string(),
  value: z.number(),
  percentage: z.number(),
  tooltip: z.string().optional(),
});
