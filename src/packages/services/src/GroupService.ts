import { z } from 'zod'
import { LiteGroupResult, PopulatedGroupResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class GroupService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetAllGroups(): Promise<LiteGroupResult[] | null> {
    return await this.Get(`/api/group`, undefined, LiteGroupResult.array())
  }

  public async GetOneGroup(groupId: string): Promise<PopulatedGroupResult | null> {
    return await this.Get(`/api/group/${encodeURIComponent(groupId)}`, undefined, PopulatedGroupResult)
  }
}


