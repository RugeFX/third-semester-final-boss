import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/members/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/members/"!</div>;
}
