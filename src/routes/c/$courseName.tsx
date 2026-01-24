import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeaders } from '@tanstack/react-start/server';
import { z } from 'zod'
import { CACHE_CONTROL } from '~/lib/cache';
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
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const courseName = data;
    
    setResponseHeaders(new Headers({
      'Cache-Control': CACHE_CONTROL
    }));

    return {
      staticCourseName: courseName,
      staticDescription: 'a description',
      staticMetaDescription: 'a meta description',
      staticHTML: 'static html',
      doesNotExist: true,
    } satisfies CourseProps

    // return Response.json({
    //   staticCourseName: courseName,
    //   staticDescription: 'a description',
    //   staticMetaDescription: 'a meta description',
    //   staticHTML: 'static html',
    //   doesNotExist: true,
    // } satisfies CourseProps, {
    //   headers: {
    //     'Cache-Control': CACHE_CONTROL
    //   }
    // })
  });

export const Route = createFileRoute('/c/$courseName')({
  loader: async ({ params: { courseName } }) => await getStaticProps({ data: courseName }),
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
