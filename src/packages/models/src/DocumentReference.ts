
import { z } from 'zod'
import { trimStart } from 'lodash-es'
import { is } from '@cougargrades/utils/zod'
import { LiteralDocumentReference } from '@cougargrades/firebase-rest-firestore'

export type DocumentReference = z.infer<typeof DocumentReference>;
// "FSDR:///catalog/ENGL 1370"
/**
 * URL strings in the format: `FSDR:///catalog/ENGL 1370`
 * 
 * Here, FSDR stands for "FireStore Document Reference", given that CougarGrades was originally powered by Google Firestore.
 * 
 * Uses `z.coerce.string()` instead of `z.url()` because we want both strings and URL objects to be acceptable as inputs
 */
export const DocumentReference = z.preprocess(val => {
    if (val instanceof LiteralDocumentReference) {
      return `FSDR:///${val.path}`;
    }
    return val;
  },
  z.coerce.string()
    .superRefine((val, ctx) => {
      try {
        const url = new URL(val);
        if (url.protocol.toLowerCase() !== 'fsdr:') {
          ctx.addIssue('URL must use the `FSDR://` protocol');
        }
      }
      catch (err) {
        ctx.addIssue('Must be a valid/parsable URL')
      }
    })
    // Normalize `FSDR:///...` (correct) and `FSDR://...` (incorrect) since we made bad data
    .transform(val => new URL(`FSDR:///${trimStart(val.substring('FSDR://'.length), '/')}`))
)
  

export const IsDocumentReference = (input: unknown) => is(input, DocumentReference);
export const IsDocumentReferenceArray = (input: unknown) => is(input, DocumentReference.array());

/**
 * Converts document paths (ex: `catalog/ABCD 1234`, or `/catalog/ABCD 1234`) into DocumentReferences
 * @param documentPath 
 * @returns 
 */
export const ToDocumentReference = (documentPath: string) => DocumentReference.parse(`FSDR:///${trimStart(documentPath, '/').split('/').map(part => encodeURIComponent(part)).join('/')}`);
