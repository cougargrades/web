
import { z } from 'zod'
import { trimEnd } from 'lodash-es'

import { BaseApiService } from './private/BaseApiService'
import { RMPRankedSearchResult } from '@cougargrades/vendor/rmp'


export class RmpService extends BaseApiService {
  constructor() {
    super()
  }

  public async search(query: string, strictSearch: boolean = true): Promise<RMPRankedSearchResult[]> {
    const qs = new URLSearchParams({
      query: query,
      strict: `${strictSearch}`
    });
    const res = await fetch(`${trimEnd(this.baseURL.href, '/')}/api/rmp/search?${qs}`);
    if (!res.ok) {
      console.error(`[RmpService] Failed to fetch RMP results (${res.status} ${res.statusText})`);
      return [];
    }
    try {
      const data = await res.json();
      const parsed = RMPRankedSearchResult.array().safeParse(data);
      if (!parsed.success) return [];
      return parsed.data;
    }
    catch (err) {
      console.error(`[RmpService] Error while parsing SimpleSyllabus results:`, err);
      return [];
    }
  }
}

