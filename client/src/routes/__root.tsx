import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/base/toast";
import type { AuthStore } from "@/lib/store/auth";

const RootLayout = () => {
	return (
		<>
			<div className="min-h-screen antialiased dark-mode text-primary bg-primary">
				<Outlet />
			</div>
			<ReactQueryDevtools position="right" />
			<TanStackRouterDevtools />
			<Toaster />
		</>
	);
};

interface RootContext {
	auth: AuthStore;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
	component: RootLayout,
});
