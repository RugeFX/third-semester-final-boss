import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.auth.token) {
			toast.error("Please login first!");
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
