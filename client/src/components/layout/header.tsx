import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthActions, useIsAuthenticated } from "@/lib/store/auth";
import { Button } from "../base/buttons/button";
import MainIcon from "../foundations/app-icons/main-icon";

export default function Header() {
	const isAuthenticated = useIsAuthenticated();
	const { signIn, signOut } = useAuthActions();
	const router = useRouter();

	const onSignIn = () => {
		signIn("token");
		toast.success("Logged in");
	};

	const onSignOut = () => {
		signOut();
		router.invalidate().finally(() => {
			router.navigate({ to: "/" });
			toast.success("Logged out");
		});
	};

	return (
		<header className="sticky top-0 z-40 border-b backdrop-blur border-white/15 bg-black/10">
			<div className="px-5 mx-auto max-w-7xl">
				<div className="flex gap-2 justify-between items-center h-14">
					<nav className="flex gap-4 items-center">
						<MainIcon className="size-10 fill-brand-500" />
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
					<div className="flex gap-1 items-center">
						<Button
							size="md"
							color="secondary"
							onClick={() => toast("Hello", { duration: Infinity })}
						>
							Click me
						</Button>
						<Button size="md" isDisabled={isAuthenticated} onClick={onSignIn}>
							Login
						</Button>
						<Button
							color="primary-destructive"
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
	);
}
