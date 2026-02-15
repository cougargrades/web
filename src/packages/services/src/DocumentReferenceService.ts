
import * as z4 from 'zod/v4/core'
import { z } from 'zod'
import { trimEnd } from 'lodash-es'
import { DocumentReference } from '@cougargrades/models'
import { SafeParseResult } from '@cougargrades/utils/zod'

import { BaseDataService } from './private/BaseDataService'
import { isNullish } from '@cougargrades/utils/nullish'


export class DocumentReferenceService extends BaseDataService {
  constructor() {
    super()
  }

  public async getDocumentByPath<TSchema extends z4.$ZodType>(documentPath: string, schema: TSchema): Promise<z4.output<TSchema> | null> {
    const docRef = DocumentReference.parse(`FSDR://${documentPath.split('/').map(part => encodeURIComponent(part)).join('/')}.json`);
    return await this.getDocument(docRef, schema);
  }

  public async getDocument<TSchema extends z4.$ZodType>(documentRef: DocumentReference, schema: TSchema): Promise<z4.output<TSchema> | null> {
    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}${documentRef.pathname}`);
    if (!res.ok) {
      console.error(`[DocumentReferenceService] Failed to resolve DocumentReference (${res.status} ${res.statusText}) at: ${documentRef.pathname}`);
      return null;
    }
    try {
      const data = await res.json();
      const parsed = z4.safeParse(schema, data);
      debugger;
      if (!parsed.success) return null;
      return parsed.data;
    }
    catch (err) {
      console.error(`[DocumentReferenceService] Error while parsing DocumentReference: ${documentRef.pathname}`, err);
      return null;
    }
  }

  public async getDocumentsConcurrently<TSchema extends z4.$ZodType>(documentRefs: DocumentReference[], schema: TSchema): Promise<z4.output<TSchema>[]> {
    const promises = documentRefs.map(ref => this.getDocument(ref, schema))
    const settled = await Promise.allSettled(promises);

    return settled
      .map(p => p.status === 'fulfilled' ? p.value : null)
      .filter(p => !isNullish(p))
      .map(p => p as z4.output<TSchema>)
  } 
}

