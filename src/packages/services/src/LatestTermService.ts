
import { z } from 'zod'
import { SearchResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class LatestTermService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetLatestTerm(): Promise<number | null> {
    return await this.Get(`/api/latest_term`, undefined, z.number().nullable());
  }
}

