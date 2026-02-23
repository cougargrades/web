import { type QueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { DocumentReference, IsDocumentReference, Section, ToQueryKeys } from '@cougargrades/models'
import { CourseService } from '@cougargrades/services'
import { isNullish } from '@cougargrades/utils/nullish';
import { useEffect } from 'react';

const courseService = new CourseService();

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams();
  const { isPending, data, error } = useQuery({
    queryKey: ['course', postId],
    queryFn: async () => await courseService.GetCourse(postId),
  })

  // useEffect(() => {
  //   console.log('data changed?', data);
  // }, [data]);

  // useEffect(() => {
  //   console.log('sectionResults changed?', sectionResults);
  // }, [sectionResults]);


  return (
    <>
    <h1>Hello Post ID# {postId}</h1>
    {
      !isNullish(error)
      ? <strong>Error: {JSON.stringify(error)}</strong>
      : null
    }
    {
      isPending
      ? <p>Loading...</p>
      : <details>
        <summary>Course Data</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    }
    
    </>
  );
}
