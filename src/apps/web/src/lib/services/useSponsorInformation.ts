
import { useQuery } from '@tanstack/react-query'

export interface SponsorshipInformation {
  totalSponsorCount: number,
  monthlyEstimatedSponsorsIncomeInCents: number,
  monthlyEstimatedSponsorsIncomeFormatted: string,
}

export function useSponsorInformation() {
  const query = useQuery<SponsorshipInformation>({
    queryKey: ['sponsor-info'],
    queryFn: async () => {
      const res = await fetch('https://github-org-stats-au5ton.vercel.app/api/sponsors');
      return await res.json();
    }
  })
  return query;
}
