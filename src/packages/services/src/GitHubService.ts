
import { z } from 'zod'
import { ContributorsResponse, SponsorResponse } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class GitHubService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetContributors(): Promise<ContributorsResponse | null> {
    return await this.Get(`/api/external/github/contributors`, undefined, ContributorsResponse)
  }

  public async GetSponsorInfo(): Promise<SponsorResponse | null> {
    return await this.Get(`/api/external/github/sponsors`, undefined, SponsorResponse)
  }
}

