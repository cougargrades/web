import { z } from 'zod'
import { AllGroupsResult, InstructorResult, PopulatedGroupResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class GroupService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetAllGroups(): Promise<AllGroupsResult | null> {
    return await this.Get(`/api/group`, undefined, AllGroupsResult)
  }

  public async GetOneGroup(groupId: string): Promise<PopulatedGroupResult | null> {
    return await this.Get(`/api/group/${encodeURIComponent(groupId)}`, undefined, PopulatedGroupResult)
  }
}


