import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		if (!context.auth.token) throw redirect({ to: "/entry", replace: true });

		throw redirect({
			to: context.auth.user?.type === "user" ? "/members" : "/check",
			replace: true,
		});
	},
});
