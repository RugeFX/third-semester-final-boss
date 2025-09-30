import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/check/")({
	component: RouteComponent,
});

function RouteComponent() {
	// TODO: Kodingkan le
	return (
		<div>
			<h1 className="text-2xl font-bold">Kodingkan disini le</h1>
		</div>
	);
}
