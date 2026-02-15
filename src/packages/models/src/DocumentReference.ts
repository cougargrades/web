
import { z } from 'zod'

export type DocumentReference = z.infer<typeof DocumentReference>;
// "FSDR:///catalog/ENGL 1370"
/**
 * URL strings in the format: `FSDR:///catalog/ENGL 1370`
 * 
 * Here, FSDR stands for "FireStore Document Reference", given that CougarGrades was originally powered by Google Firestore
 */
export const DocumentReference = z.url({ protocol: /^fsdr$/ }).transform(val => new URL(val));
