import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/members")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.auth.token) {
			toast.error("Silahkan masuk terlebih dahulu!");
			throw redirect({ to: "/sign-in" });
		}
	},
});

/**
 * Renders the UI for the "/members" route.
 *
 * @returns The React element displayed for the members route.
 */
function RouteComponent() {
	return <div>Hello "/members"!</div>;
}