import type { Course } from '@cougargrades/types'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server';
import { z } from 'zod'
import { defaultComparator } from '~/components/datatable';
import { CACHE_CONTROL } from '~/lib/cache';
import { getFirestoreDocument } from '~/lib/data/firebase.server';
import { metaCourseDescription } from '~/lib/seo';
// import { NotFound } from '~/components/NotFound'
// import { UserErrorComponent } from 'src/components/UserError'
import type { User } from '~/utils/users'

export interface CourseProps {
  staticCourseName: string;
  staticDescription: string;
  staticLongDescription?: string;
  staticMetaDescription: string;
  staticHTML: string;
  doesNotExist?: boolean;
}

const ParamsSchema = z.object({
  courseName: z.string(),
})

const getStaticProps = createServerFn({ method: 'GET' })
  .inputValidator(ParamsSchema)
  .handler(async ({ data }) => {
    const courseName = data.courseName;
    const courseData = await getFirestoreDocument<Course>(`/catalog/${courseName}`)
    const { data: searchableData } = await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')
    const description = courseData !== undefined ? courseData.description : ''
    const longDescription = searchableData.find(e => e.courseName === courseName)?.publicationTextContent ?? '';
    const metaDescription = metaCourseDescription({
      staticCourseName: courseName,
      staticDescription: description,
      staticLongDescription: longDescription,
    })
    const recentPublication = courseData && courseData.publications !== undefined && 
      Array.isArray(courseData.publications) &&
      courseData.publications.length > 0
      ? 
      courseData.publications.sort((a,b) => defaultComparator(a.catoid, b.catoid))[0]
      :
      undefined;
    const { content } = recentPublication || {}

    return { 
      staticCourseName: courseName,
      staticDescription: description,
      staticLongDescription: longDescription,
      staticMetaDescription: metaDescription,
      staticHTML: content ?? '',
      doesNotExist: courseData === undefined,
    } satisfies CourseProps
  });

export const Route = createFileRoute('/c/$courseName')({
  loader: async ({ params: { courseName } }) => await getStaticProps({ data: { courseName } }),
  head: ({ loaderData }) => ({
    meta: !loaderData ? undefined : [
      { title: `${loaderData.staticCourseName} / CougarGrades.io` }
    ]
  }),
  headers: () => ({
    'Cache-Control': CACHE_CONTROL,
  }),
  component: IndividualCourse,
})

function IndividualCourse() {
  const { staticCourseName, staticDescription, staticMetaDescription, staticHTML, doesNotExist } = Route.useLoaderData();

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{staticCourseName}</h4>
      <div className="text-sm">{staticDescription}</div>
      <div className="text-sm">{staticMetaDescription}</div>
      <div className="text-sm">{staticHTML}</div>
    </div>
  )
}
