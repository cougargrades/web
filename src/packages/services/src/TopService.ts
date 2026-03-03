
import { z } from 'zod'
import { TopOptions, TopResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'


export class TopService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<TopResult[]> {
    return await this.Get(`/api/top`, { metric, topic, limit: limit.toString(), time, hideCore: `${hideCore}` }, TopResult.array()) ?? [];
  }
}

