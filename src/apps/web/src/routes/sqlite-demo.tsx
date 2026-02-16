import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { query, SAMPLE_QUERY } from '../lib/sqlite-demo'

export const Route = createFileRoute('/sqlite-demo')({
  component: RouteComponent,
})

function RouteComponent() {
  // const { isPending, data, error } = useQuery({
  //   queryKey: ['sqlite-demo'],
  //   queryFn: async () => await query(SAMPLE_QUERY),
  // })

  async function doThing() {
    const data = await query(SAMPLE_QUERY);
    console.log('data?', data);
  }
  
  return (
    <>
    <div>Hello "/sqlite-demo"!</div>
    <h2>Rows</h2>
    <button onClick={doThing}>Do Thing</button>
    {/* <ul>
      {(data ?? []).map(row => 
        <li key={row.rowNumber}>
          { JSON.stringify(row) }
        </li>
      )}
    </ul> */}
    </>
  )
}
