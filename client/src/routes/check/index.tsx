import { createFileRoute } from "@tanstack/react-router";

import CheckForm from "@/components/check/form";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/check/")({
	component: RouteComponent,
	head: () => ({
		meta: [routeTitle("Periksa Kendaraan")],
	}),
});

function RouteComponent() {
	return <CheckForm />;
}
