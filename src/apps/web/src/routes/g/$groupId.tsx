import { createFileRoute, notFound } from '@tanstack/react-router'
import { Alert, AlertTitle, Container } from '@mui/material';
import { } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';
import type { Comparator } from '@cougargrades/utils/comparator';
import { allGroupsDataQueryOptions, useAllGroups } from '../../lib/services/useAllGroups';
import { oneGroupDataQueryOptions, useOneGroup } from '../../lib/services/useOneGroup';
import { PankoRow } from '../../components/panko';
import { SidebarContainer, type SidebarItem } from '../../components/sidebarcontainer';
import { AllSubjectsList } from '../../components/AllSubjectsList';
import { GroupContentSkeleton } from '../../components/groupcontent';
import { GetGroupLayoutFromCategories } from '@cougargrades/models/dto';


export const Route = createFileRoute('/g/$groupId')({
  async loader(ctx) {
    const { groupId } = ctx.params;
    // Start pre-loading the "All Groups" stuff, but it's not necessary to render the page
    ctx.context.queryClient.ensureQueryData(allGroupsDataQueryOptions());
    const oneGroup = await ctx.context.queryClient.ensureQueryData(oneGroupDataQueryOptions(ctx.params.groupId));
    if (isNullish(oneGroup)) {
      throw notFound();
    }
    return oneGroup;
  },
  head: (ctx) => {
    const group = ctx.loaderData;
    return {
      meta: [
        { title: `${group?.name ?? 'Groups'} / CougarGrades.io` },
        { name: 'description', content: `${group?.description ?? ''}` }
      ]
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const { groupId } = Route.useParams()
  //const { doesNotExist, isFakeGroup, oneGroup, groupName, groupDescription, fakeGroupData, filterSubjects } = Route.useLoaderData();
  const { data, isPending } = useOneGroup(groupId);

  const { data: sidebarItems } = useAllGroups();
  const preferredCategories = [
    'UH Core Curriculum (All)',
    'Colleges/Schools',
    'Other Groups'
  ]
  /**
   * Sort the categories in an arbitrary/hard-coded way
   */
  const categoryComparator: Comparator<string> = (a, b) => {
    return preferredCategories.indexOf(a) - preferredCategories.indexOf(b)
  }

  const layout = (
    !isNullish(data)
    ? GetGroupLayoutFromCategories(data.categories)
    : null
  )
  
  return (
    <>
    <Container>
      <PankoRow />
    </Container>
    <SidebarContainer condensedTitle="Select Group" sidebarItems={sidebarItems ?? []} categoryComparator={categoryComparator} showOverflowScrollers>
      <h1>{data?.name}</h1>
      <h5>Layout: <code>{layout}</code></h5>
      <p>PLACEHOLDER</p>
      <GroupContentSkeleton />
      
      {/* {
        isPending
        ? <GroupContentSkeleton />
        : (
          layout === 'RelatedGroupList'
          ? <AllSubjectsList title={groupName} caption={groupDescription} onlySubjects={filterSubjects} />
          : <GroupContent data={oneGroup} />
        )
      } */}
    </SidebarContainer>
    </>
  )
}

function NotFoundComponent() {
  const { groupId } = Route.useParams();
  const { data: sidebarItems } = useAllGroups();
  const preferredCategories = [
    'UH Core Curriculum (All)',
    'Colleges/Schools',
    'Other Groups'
  ]
  /**
   * Sort the categories in an arbitrary/hard-coded way
   */
  const categoryComparator: Comparator<string> = (a, b) => {
    return preferredCategories.indexOf(a) - preferredCategories.indexOf(b)
  }

  return (
    <>
    <Container>
      <PankoRow />
    </Container>
    <SidebarContainer condensedTitle="Select Group" sidebarItems={sidebarItems ?? []} categoryComparator={categoryComparator} showOverflowScrollers>
      <Alert severity="error">
        <AlertTitle>Error 404</AlertTitle>
        Group &quot;<code className="plain">{groupId}</code>&quot; could not be found.
      </Alert>
    </SidebarContainer>
    </>
  )
}
