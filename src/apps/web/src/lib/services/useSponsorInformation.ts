import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { SponsorResponse } from '@cougargrades/models/dto'
import { GitHubService } from '@cougargrades/services';
import { isNullish } from '@cougargrades/utils/nullish';

export type SponsorshipInformation = z.infer<typeof SponsorshipInformation>
export const SponsorshipInformation = SponsorResponse.extend({
  monthlyEstimatedSponsorsIncomeFormatted: z.string()
})

export function useSponsorInformation() {
  const query = useQuery<SponsorshipInformation>({
    queryKey: ['github', 'sponsor-info'],
    queryFn: async () => {
      const svc = new GitHubService();
      const data = await svc.GetSponsorInfo();
      const fmt = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      })

      if (isNullish(data)) {
        throw new Error(`Sponsor data is null! This shouldn't happen!`)
      }

      return {
        ...data,
        monthlyEstimatedSponsorsIncomeFormatted: fmt.format(data.monthlyEstimatedSponsorsIncomeInCents / 100)
      }
    }
  })
  return query;
}
