import { createFileRoute } from '@tanstack/react-router'
import type { User } from '~/utils/users'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params: { userId } }) => {
    try {
      const res = await fetch('/api/users/' + userId)
      if (!res.ok) {
        throw new Error('Unexpected status code')
      }

      const data = await res.json()

      return data as User
    } catch {
      throw new Error('Failed to fetch user')
    }
  },
  component: UserComponent,
})

function UserComponent() {
  const {} = Route.useParams();
  const user = Route.useLoaderData()

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{user.name}</h4>
      <div className="text-sm">{user.email}</div>
      <div>
        <a
          href={`/api/users/${user.id}`}
          className="text-blue-800 hover:text-blue-600 underline"
        >
          View as JSON
        </a>
      </div>
    </div>
  )
}
