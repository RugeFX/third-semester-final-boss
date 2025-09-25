import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/a')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/a"!</div>
}
