
import { z } from 'zod'

export type GitHubUser = z.infer<typeof GitHubUser>
export const GitHubUser = z.object({
  id: z.number(),
  name: z.string().nullable(),
  login: z.string(),
  html_url: z.string(),
  avatar_url: z.string(),
})

export type ContributorsResponse = z.infer<typeof ContributorsResponse>
export const ContributorsResponse = z.object({
  public_members: GitHubUser.array(),
  contributors: GitHubUser.array(),
})

export type SponsorResponse = z.infer<typeof SponsorResponse>
export const SponsorResponse = z.object({
  // public_members: GitHubUser.array(),
  // contributors: GitHubUser.array(),
  totalSponsorCount: z.number(),
  monthlyEstimatedSponsorsIncomeInCents: z.number(),
})
