
import { z } from 'zod'
import type { Octokit } from '@octokit/rest'
import { SponsorResponse } from '@cougargrades/models/dto'


export async function getSponsorInformation(octokit: Octokit): Promise<SponsorResponse> {
  const res = await octokit.graphql<any>(`
    query {
      viewer {
        login
        sponsors {
          totalCount
        }
        monthlyEstimatedSponsorsIncomeInCents
      }
    }
  `);

  const data: unknown = {
    totalSponsorCount: res.viewer.sponsors.totalCount,
    monthlyEstimatedSponsorsIncomeInCents: res.viewer.monthlyEstimatedSponsorsIncomeInCents,
  };

  // Violently error if things aren't what they seem
  return SponsorResponse.parse(data)
}
