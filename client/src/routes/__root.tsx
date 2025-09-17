import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { toast } from "sonner";
import { Button } from "@/components/base/buttons/button";
import { Toaster } from "@/components/base/toast";

const RootLayout = () => (
	<>
		<div className="min-h-screen">
			<header className="flex gap-2 p-2 px-5 py-3 border-b-2 border-white">
				<Button to="/" className="[&.active]:font-bold">
					Home
				</Button>{" "}
				<Button to="/about" className="data-[status=active]:font-bold">
					About
				</Button>
				<Button onClick={() => toast.success("Hello")}>Click me</Button>
			</header>
			<main className="px-5 py-3">
				<Outlet />
			</main>
		</div>
		<ReactQueryDevtools position="right" />
		<TanStackRouterDevtools />
		<Toaster />
	</>
);

interface RootContext {
	user: {
		id: string;
		name: string;
	};
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
	component: RootLayout,
});
