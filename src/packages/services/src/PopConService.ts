
import { z } from 'zod'
import { PopCon } from '@cougargrades/models';
import { BaseApiService } from './private/BaseApiService'


export class PopConService extends BaseApiService {
  constructor() {
    super()
  }

  public async SubmitRecord({ pathname, type }: Pick<PopCon, 'pathname' | 'type'>, turnstile_token: string): Promise<void> {
    // If the browser accepted our request to use `navigator.sendBeacon()`, then stop here
    const didQueue = this.SendBeacon(`/api/popularity_contest/submit`, { pathname, type: type.toString() }, new URLSearchParams({ turnstile_token, }))
    if (didQueue) return;

    // Otherwise, do a normal fetch (with low priority)!
    await this.Post(`/api/popularity_contest/submit`, { pathname, type: type.toString(), }, undefined, { priority: 'low', body: new URLSearchParams({ turnstile_token, }) });
  }
}

