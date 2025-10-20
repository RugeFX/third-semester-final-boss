import { createFileRoute, redirect } from "@tanstack/react-router";

import CheckForm from "@/components/check/form";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/check/")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.auth.token) throw redirect({ to: "/check/details" });
	},
	head: () => ({
		meta: [routeTitle("Periksa Kendaraan")],
	}),
});

function RouteComponent() {
	return (
		<div className="container grow grid px-6 py-7 mx-auto size-full sm:px-8 md:px-12 lg:px-16">
			<CheckForm />
		</div>
	);
}
