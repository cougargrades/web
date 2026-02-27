import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/g/$groupId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/g/$groupId"!</div>
}
