import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { toast } from "sonner";

import { Button } from "@/components/base/buttons/button";
import { Toaster } from "@/components/base/toast";
import {
	type AuthStore,
	useAuthActions,
	useIsAuthenticated,
} from "@/lib/store/auth";

const RootLayout = () => {
	const isAuthenticated = useIsAuthenticated();
	const { signIn, signOut } = useAuthActions();

	return (
		<>
			<div className="min-h-screen">
				<header className="flex gap-2 p-2 px-5 py-3 border-b-2 border-white">
					<Button to="/" className="[&.active]:font-bold">
						Home
					</Button>{" "}
					<Button to="/about" className="data-[status=active]:font-bold">
						About
					</Button>
					<Button to="/a" className="data-[status=active]:font-bold">
						Authed a
					</Button>
					<Button onClick={() => toast.success("Hello")}>Click me</Button>
					<Button isDisabled={isAuthenticated} onClick={() => signIn("token")}>
						Login
					</Button>
					<Button isDisabled={!isAuthenticated} onClick={() => signOut()}>
						Logout
					</Button>
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
};

interface RootContext {
	auth: AuthStore;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
	component: RootLayout,
});
