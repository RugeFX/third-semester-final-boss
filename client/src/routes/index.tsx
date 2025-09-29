import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/base/buttons/button";
import { useAuthActions, useIsAuthenticated } from "@/lib/store/auth";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	head: () => ({
		meta: [routeTitle("Home")],
	}),
});

function RouteComponent() {
	const router = useRouter();
	const isAuthenticated = useIsAuthenticated();
	const { signOut } = useAuthActions();

	const onSignIn = () => {
		router.navigate({ to: "/sign-in" });
	};

	const onSignOut = () => {
		signOut();
		router.invalidate().finally(() => {
			router.navigate({ to: "/sign-in" });
		});
	};

	return (
		<div>
			Hello "/"!
			<Button size="md" onClick={isAuthenticated ? onSignOut : onSignIn}>
				{isAuthenticated ? "Sign Out" : "Sign In"}
			</Button>
		</div>
	);
}
