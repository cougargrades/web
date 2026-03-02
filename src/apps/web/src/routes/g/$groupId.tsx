import { createFileRoute, notFound } from '@tanstack/react-router'
import { Alert, AlertTitle, Container } from '@mui/material';
import { metaFakeGroupDescription, type Group } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';
import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import counts from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/counts.json'
import { allGroupsDataQueryOptions, useAllGroups } from '../../lib/services/useAllGroups';
import { oneGroupDataQueryOptions, useOneGroup } from '../../lib/services/useOneGroup';
import { PankoRow } from '../../components/panko';
import { SidebarContainer, type SidebarItem } from '../../components/sidebarcontainer';
import { AllSubjectsList } from '../../components/AllSubjectsList';
import { GroupContent, GroupContentSkeleton } from '../../components/groupcontent';


const FAKE_GROUPS: Group[] = [
  ...curated_colleges.filter(college => !['college-exploratory'].includes(college.identifier)).map<Group>(college => ({
    identifier: college.identifier,
    name: college.groupLongTitle,
    shortName: college.groupShortTitle,
    description: metaFakeGroupDescription(college.identifier, false),
    courses: [],
    sections: [],
    relatedGroups: [],
    categories: ['Colleges/Schools'],
    sources: [],
  })),
  {
    name: 'All Subjects',
    identifier: 'all-subjects',
    description: `Every Subject available at the University of Houston. ${counts.num_subjects} Subjects in total.`,
    courses: [],
    sections: [],
    relatedGroups: [],
    categories: ['Other Groups'],
    sources: [],
  }
]


export const Route = createFileRoute('/g/$groupId')({
  async loader(ctx) {
    const { groupId } = ctx.params
    const [allGroups, oneGroup] = await Promise.all([
      ctx.context.queryClient.ensureQueryData(allGroupsDataQueryOptions()),
      ctx.context.queryClient.ensureQueryData(oneGroupDataQueryOptions(ctx.params.groupId))
    ]);

    const fakeGroupData = FAKE_GROUPS.find(e => e.identifier === groupId);
    const isFakeGroup = !isNullish(fakeGroupData);

    const doesNotExist = isNullish(fakeGroupData) && isNullish(oneGroup);
    const groupName = fakeGroupData?.name ?? oneGroup?.title ?? '';
    const groupDescription = fakeGroupData?.description ?? oneGroup?.description ?? '';
    const metaDescription = (
      isFakeGroup && fakeGroupData.categories.includes('Colleges/Schools')
      ? metaFakeGroupDescription(fakeGroupData.identifier)
      : oneGroup?.description ?? ''
    )
    const filterSubjects = isFakeGroup ? curated_colleges.find(e => e.identifier === groupId)?.subjects ?? [] : []

    return {
      doesNotExist,
      isFakeGroup,
      allGroups,
      oneGroup,
      groupName,
      groupDescription,
      fakeGroupData,
      metaDescription,
      filterSubjects,
    }
  },
  head: (ctx) => {
    const { doesNotExist, oneGroup, fakeGroupData, metaDescription } = ctx.loaderData ?? {}
    const groupName = fakeGroupData?.name ?? oneGroup?.title ?? ''

    return {
      meta: [
        { title: doesNotExist === true ? '404 Not Found / CougarGrades.io' : `${groupName} / CougarGrades.io` },
        { name: 'description', content: `${metaDescription}` }
      ]
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { groupId } = Route.useParams()
  const { doesNotExist, isFakeGroup, oneGroup, groupName, groupDescription, fakeGroupData, filterSubjects } = Route.useLoaderData();

  const { data, isPending: isPending2 } = useAllGroups();
  const allGroupsData = data?.core_curriculum ?? [];
  const sidebarItems: SidebarItem[] = [
    ...(allGroupsData.map(group => ({
      key: group.key,
      categoryName: group.categories.filter(e => !e.startsWith('#'))[0] ?? '',
      title: group.title,
      href: group.href,
    }))),
    ...(FAKE_GROUPS.map(group => ({
      key: group.identifier,
      categoryName: Array.isArray(group.categories) ? group.categories[0] : '',
      title: group.shortName ?? group.name,
      href: `/g/${group.identifier}`,
    }))),
  ]

  
  return (
    <>
    <Container>
      <PankoRow />
    </Container>
    <SidebarContainer condensedTitle="Select Group" sidebarItems={sidebarItems} showOverflowScrollers>
      { doesNotExist === true ? 
        <Alert severity="error">
          <AlertTitle>Error 404</AlertTitle>
          Group {groupId} could not be found.
        </Alert>
      : <></>
      }
      { }
      {
        isFakeGroup && !doesNotExist
        ? <AllSubjectsList title={groupName} caption={groupDescription} onlySubjects={filterSubjects} />
        : (
          doesNotExist === false && !isNullish(oneGroup)
          ? <GroupContent data={oneGroup} />
          : <GroupContentSkeleton />
        )
      }
    </SidebarContainer>
    </>
  )
}

