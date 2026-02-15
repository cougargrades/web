
import * as z4 from 'zod/v4/core'
import { z } from 'zod'
import * as path from '@std/path'
import { trimEnd, trimStart } from 'lodash-es'
import { DocumentReference, ToDocumentReference } from '@cougargrades/models'

import { BaseDataService } from './private/BaseDataService'
import { isNullish, isNullishOrWhitespace } from '@cougargrades/utils/nullish'

const DEFAULT_EXTENSION = '.json';

export class DocumentReferenceService extends BaseDataService {
  constructor() {
    super()
  }

  public async GetDocumentByPath<TSchema extends z4.$ZodType>(documentPath: string, schema: TSchema): Promise<z4.output<TSchema> | null> {
    const docRef = ToDocumentReference(documentPath);
    return await this.GetDocument(docRef, schema);
  }

  public async GetDocument<TSchema extends z4.$ZodType>(documentRef: DocumentReference, schema: TSchema): Promise<z4.output<TSchema> | null> {
    const HAS_EXTENSION = !isNullishOrWhitespace(path.extname(documentRef.pathname));
    const subpath = HAS_EXTENSION ? documentRef.pathname : `${documentRef.pathname}${DEFAULT_EXTENSION}`;
    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}${subpath}`);
    if (!res.ok) {
      console.error(`[DocumentReferenceService] Failed to resolve DocumentReference (${res.status} ${res.statusText}) at: ${documentRef.pathname}`);
      return null;
    }
    try {
      const data = await res.json();
      const parsed = z4.safeParse(schema, data);
      if (!parsed.success) return null;
      return parsed.data;
    }
    catch (err) {
      console.error(`[DocumentReferenceService] Error while parsing DocumentReference: ${documentRef.pathname}`, err);
      return null;
    }
  }

  public async GetDocumentsConcurrently<TSchema extends z4.$ZodType>(documentRefs: DocumentReference[], schema: TSchema): Promise<z4.output<TSchema>[]> {
    const promises = documentRefs.map(ref => this.GetDocument(ref, schema))
    const settled = await Promise.allSettled(promises);

    return settled
      .map(p => p.status === 'fulfilled' ? p.value : null)
      .filter(p => !isNullish(p))
      .map(p => p as z4.output<TSchema>)
  } 
}

