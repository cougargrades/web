
import { z } from 'zod'
import { PopCon } from '@cougargrades/models';
import { BaseApiService } from './private/BaseApiService'


export class PopConService extends BaseApiService {
  constructor() {
    super()
  }

  public async SubmitRecord({ pathname, type }: Pick<PopCon, 'pathname' | 'type'>): Promise<void> {
    await this.Post(`/api/popularity_contest/submit`, { pathname, type: type.toString() }, z.any());
  }
}

