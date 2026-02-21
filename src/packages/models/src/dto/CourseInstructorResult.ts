import { z } from 'zod'
import { SearchResultBadge } from './Badges'

export type CourseInstructorResult = z.infer<typeof CourseInstructorResult>
export const CourseInstructorResult = z.object({
  key: z.string(),              // used for react, same as document path
  href: z.string(),             // where to redirect the user when selected
  title: z.string(),            // typically the instructor's full name
  altTitle: z.string().optional(), // last‑name‑first fullname
  subtitle: z.string(),         // instructor’s departments
  caption: z.string(),          // “4 courses • 5 sections”
  badges: SearchResultBadge.array(),
  id: z.string(),
  lastInitial: z.string(),
})
