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

function RouteComponent() {
	return <div>Hello "/members"!</div>;
}
