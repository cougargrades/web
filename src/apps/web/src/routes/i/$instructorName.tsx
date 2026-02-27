import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/i/$instructorName')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/i/$instructorName"!</div>
}
