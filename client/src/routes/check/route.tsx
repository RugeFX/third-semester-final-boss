import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/header";

export const Route = createFileRoute("/check")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex flex-col size-full">
			<Header />
			<Outlet />
		</div>
	);
}
