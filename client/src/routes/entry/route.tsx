import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/header";

export const Route = createFileRoute("/entry")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col min-h-screen size-full">
			<Header />
			<div className="container grid flex-1 px-6 py-7 mx-auto size-full sm:px-8 md:px-12 lg:px-16">
				<Outlet />
			</div>
		</div>
	);
}
