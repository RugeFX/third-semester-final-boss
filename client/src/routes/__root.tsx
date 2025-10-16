import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import LoadingIndicator from "@/components/base/loading-indicator";
import { Toaster } from "@/components/base/toast";
import type { AuthStore } from "@/lib/store/auth";
import { routeTitle } from "@/lib/utils/title";

const RootLayout = () => {
	return (
		<>
			<HeadContent />
			<div className="min-h-screen antialiased dark-mode text-primary bg-primary">
				<Outlet />
			</div>
			<Toaster />
			<ReactQueryDevtools position="right" />
			<TanStackRouterDevtools />
		</>
	);
};

interface RootContext {
	auth: AuthStore;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
	component: RootLayout,
	head: () => ({
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
		],
		meta: [
			routeTitle(),
			{
				name: "description",
				content: "Parkir tanpa ribet, dalam genggaman tangan",
			},
		],
	}),
});
