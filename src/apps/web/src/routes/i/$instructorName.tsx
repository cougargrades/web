import { createFileRoute, notFound } from '@tanstack/react-router'
import { Alert, AlertTitle, Container } from '@mui/material';
import { metaInstructorDescription } from '@cougargrades/models';
import { isNullish } from '@cougargrades/utils/nullish';
import { instructorDataQueryOptions, useInstructorData } from '../../lib/services/useInstructorData'
import { PankoRow } from '../../components/panko';





import styles from './instructor.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export const Route = createFileRoute('/i/$instructorName')({
  async loader(ctx) {
    const queryOptions = instructorDataQueryOptions(ctx.params.instructorName);
    const data = await ctx.context.queryClient.ensureQueryData(queryOptions);
    if (isNullish(data)) {
      throw notFound();
    }
    return data;
  },
  head: (ctx) => {
    const data = ctx.loaderData
    const metaDescription = metaInstructorDescription({
      ...(data ?? {})
    })
    return {
      meta: [
        { title: `${data?.meta.fullName ?? ctx.params.instructorName} / CougarGrades.io` },
        { name: 'description', content: `${metaDescription}` }
      ]
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  return <div>Hello "/i/$instructorName"!</div>
}

function NotFoundComponent() {
  const { instructorName } = Route.useParams();

  return (
    <Container>
      <PankoRow />
      <main>
        <div className={styles.courseHero}>
          <Alert severity="error">
            <AlertTitle>Error 404</AlertTitle>
            Instructor &quot;<code className="plain">{instructorName}</code>&quot; could not be found.
          </Alert>
          <div style={{ height: '200px' }}></div>
        </div>
      </main>
    </Container>
  )
}
