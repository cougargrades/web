
import { z } from 'zod'
import { DocumentReference } from './DocumentReference';
import { Instructor } from './Instructor';
import { Course, LabeledLink } from './Course';
import { Section } from './Section';

export type Group = z.infer<typeof Group>;
export const Group = z.object({
  name: z.string(),
  shortName: z.string().nullish(),
  identifier: z.string(),
  description: z.string(),
  get courses() {
    return z.union([ DocumentReference.array(), Course.array() ])
  },
  get sections() {
    return z.union([ DocumentReference.array(), Section.array() ])
  },
  get relatedGroups() {
    return z.union([ DocumentReference.array(), Group.array() ])
  },
  keywords: z.string().array(),
  categories: z.string().array(),
  get sources() {
    return LabeledLink.array()
  }
})
