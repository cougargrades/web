
import { useQuery } from '@tanstack/react-query'
import type { CollaboratorProps } from '../../components/collaborator';
import { ContributorsResponse } from '@cougargrades/models/dto'
import { GitHubService } from '@cougargrades/services';


export interface CollaboratorResponse {
  public_members: CollaboratorProps[],
  contributors: CollaboratorProps[]
}

export function useCollaboratorInformation() {
  const query = useQuery<ContributorsResponse>({
    queryKey: ['collaborator-info'],
    queryFn: async () => {
      const svc = new GitHubService();
      const data = await svc.GetContributors()
      return data ?? { public_members: [], contributors: [] };
    }
  })
  return query;
}
