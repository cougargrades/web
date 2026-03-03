
import { z } from 'zod'
import { SearchResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class TrendingService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetTrending(limit: number = 5): Promise<SearchResult[]> {
    return await this.Get(`/api/trending`, { limit: limit.toString() }, SearchResult.array()) ?? []
  }
}

