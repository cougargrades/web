
import { queryOptions, useQuery } from '@tanstack/react-query'
import { GroupService } from '@cougargrades/services'


export function allGroupsDataQueryOptions() {
  return queryOptions({
    queryKey: ['all-groups'],
    queryFn: async () => {
      const svc = new GroupService();
      return await svc.GetAllGroups();
    }
  })
}

export function useAllGroups() {
  const options = allGroupsDataQueryOptions();
  const query = useQuery(options);
  return query;
}
