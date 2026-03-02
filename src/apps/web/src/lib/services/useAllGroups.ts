
import { queryOptions, useQuery } from '@tanstack/react-query'
import { GroupService } from '@cougargrades/services'
import type { LiteGroupResult } from '@cougargrades/models/dto';
import type { SidebarItem } from '../../components/sidebarcontainer';


export function allGroupsDataQueryOptions() {
  return queryOptions({
    queryKey: ['all-groups'],
    queryFn: async () => {
      const svc = new GroupService();
      return await svc.GetAllGroups();
    },
    select: (res): SidebarItem[] => res?.map<SidebarItem>(group => ({
      key: group.identifier,
      categoryName: group.categories.filter(e => !e.startsWith('#'))[0] ?? '',
      title: group.shortName ?? group.name,
      href: group.href,
    })) ?? []
  })
}

export function useAllGroups() {
  const options = allGroupsDataQueryOptions();
  const query = useQuery(options);
  return query;
}
