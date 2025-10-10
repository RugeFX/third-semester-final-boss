import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/members/")({
	component: RouteComponent,
});

/**
 * React component rendered for the "/members/" route.
 *
 * Renders a div containing the text `Hello "/members/"!`.
 *
 * @returns A JSX element displaying the greeting for the "/members/" route.
 */
function RouteComponent() {
	return <div>Hello "/members/"!</div>;
}