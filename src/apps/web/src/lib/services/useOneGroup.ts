
import { queryOptions, useQuery } from '@tanstack/react-query'
import { GroupService } from '@cougargrades/services'


export function oneGroupDataQueryOptions(groupId: string) {
  return queryOptions({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const svc = new GroupService();
      return await svc.GetOneGroup(groupId)
    }
  })
}

export function useOneGroup(groupId: string) {
  const options = oneGroupDataQueryOptions(groupId);
  const query = useQuery(options);
  return query;
}
