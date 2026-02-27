import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/c/$courseName')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/c/$courseName"!</div>
}
