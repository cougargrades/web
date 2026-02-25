
import { useQuery } from '@tanstack/react-query'
import type { CollaboratorProps } from '../../components/collaborator';

export interface SponsorshipInformation {
  totalSponsorCount: number,
  monthlyEstimatedSponsorsIncomeInCents: number,
  monthlyEstimatedSponsorsIncomeFormatted: string,
}

export interface CollaboratorResponse {
  public_members: CollaboratorProps[],
  contributors: CollaboratorProps[]
}

export function useCollaboratorInformation() {
  const query = useQuery<CollaboratorResponse>({
    queryKey: ['collaborator-info'],
    queryFn: async () => {
      const res = await fetch('https://github-org-stats-au5ton.vercel.app/api/cougargrades');
      return await res.json();
    }
  })
  return query;
}
