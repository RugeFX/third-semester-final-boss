import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	Outlet,
	useRouter,
} from "@tanstack/react-router";
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
	const router = useRouter();

	const onSignOut = () => {
		signOut();
		router.invalidate().finally(() => {
			router.navigate({ to: "/" });
			toast.success("Logged out");
		});
	};

	return (
		<>
			<div className="min-h-screen">
				<header className="sticky top-0 z-40 border-b border-white/15 bg-black/10 backdrop-blur">
					<div className="mx-auto max-w-7xl px-5">
						<div className="flex h-14 items-center justify-between gap-2">
							<nav className="flex items-center gap-4">
								<Button
									to="/"
									color="link-gray"
									size="md"
									className="data-[status=active]:text-white"
								>
									Home
								</Button>
								<Button
									to="/about"
									color="link-gray"
									size="md"
									className="data-[status=active]:text-white"
								>
									About
								</Button>
								<Button
									to="/a"
									color="link-gray"
									size="md"
									className="data-[status=active]:text-white"
								>
									Authed a
								</Button>
							</nav>
							<div className="flex items-center gap-1">
								<Button
									size="md"
									color="secondary"
									onClick={() => toast.success("Hello", { duration: Infinity })}
								>
									Click me
								</Button>
								<Button
									size="md"
									isDisabled={isAuthenticated}
									onClick={() => signIn("token")}
								>
									Login
								</Button>
								<Button
									size="md"
									isDisabled={!isAuthenticated}
									onClick={onSignOut}
								>
									Logout
								</Button>
							</div>
						</div>
					</div>
				</header>
				<main className="mx-auto max-w-7xl px-5 py-5">
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
