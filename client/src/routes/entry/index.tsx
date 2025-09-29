import { createFileRoute } from "@tanstack/react-router";

import EntryForm from "@/components/entry/form";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/entry/")({
	component: RouteComponent,
	head: () => ({
		meta: [routeTitle("Masuk Kendaraan")],
	}),
});

function RouteComponent() {
	return <EntryForm />;
}
