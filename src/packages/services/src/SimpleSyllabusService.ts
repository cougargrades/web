
import { z } from 'zod'
import { trimEnd } from 'lodash-es'

import { BaseApiService } from './private/BaseApiService'
import { SSSearchResponse } from '@cougargrades/vendor/simplesyllabus'


export class SimpleSyllabusService extends BaseApiService {
  constructor() {
    super()
  }

  public async search(query: string, strictSearch: boolean = true): Promise<SSSearchResponse> {
    const qs = new URLSearchParams({
      query: query,
      strict: `${strictSearch}`
    });
    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}/api/external/simplesyllabus/search?${qs}`);
    if (!res.ok) {
      console.error(`[SimpleSyllabusService] Failed to fetch SimpleSyllabus results (${res.status} ${res.statusText})`);
      return { sys: { success: false }, items: [] };
    }
    try {
      const data = await res.json();
      const parsed = SSSearchResponse.safeParse(data);
      if (!parsed.success) return { sys: { success: false }, items: [] };
      return parsed.data;
    }
    catch (err) {
      console.error(`[SimpleSyllabusService] Error while parsing SimpleSyllabus results:`, err);
      return { sys: { success: false }, items: [] };
    }
  }
}

