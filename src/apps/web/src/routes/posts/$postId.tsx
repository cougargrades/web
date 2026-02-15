import { type QueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { DocumentReference, IsDocumentReference, Section, ToQueryKeys } from '@cougargrades/models'
import { CourseService, SectionService } from '@cougargrades/services'
import { isNullish } from '@cougargrades/utils/nullish';
import { useEffect } from 'react';

const courseService = new CourseService();
const sectionService = new SectionService();

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams();
  const { isPending, data, error } = useQuery({
    queryKey: ['catalog', postId],
    queryFn: async () => await courseService.GetCourse(postId),
  })

  const sectionResults = useQueries({
    queries: isNullish(data) ? [] : data.sections
      .filter<DocumentReference>(s => IsDocumentReference(s))
      .map(docRef => ({
        queryKey: ToQueryKeys(docRef),
        queryFn: async () => {
          return await sectionService.GetDocument(docRef, Section)
        },
      })),
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
    <h2>Sections</h2>
    <ul>
      {sectionResults.map((r, idx) => 
        <li key={r.data?._id ?? idx}>
          {
            r.isPending
            ? 'Loading...'
            : (
              r.error !== null
              ? <span>Error: {JSON.stringify(error)}</span>
              : r.data?._id ?? '(nullish)'
            )
          }
        </li>
      )}
    </ul>
    
    </>
  );
}
