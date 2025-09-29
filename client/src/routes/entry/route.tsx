import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/base/buttons/button";
import MainIcon from "@/components/foundations/app-icons/main-icon";
import { APP_NAME } from "@/lib/utils/constants";

export const Route = createFileRoute("/entry")({
	component: RouteComponent,
});

function Header() {
	return (
		<header className="container flex justify-between items-center px-6 py-7 mx-auto w-full sm:px-8 md:px-12 lg:px-16">
			<Link to="/entry" className="flex gap-3 items-center">
				<MainIcon className="size-16 fill-brand-500" />
				<h3 className="text-3xl font-bold">{APP_NAME}</h3>
			</Link>
			<div className="flex gap-4 items-center">
				<Button size="xl" to="/sign-in">
					Join Membership
				</Button>
				<Button color="secondary" size="xl" to="/sign-in">
					Periksa Kendaraan
				</Button>
			</div>
		</header>
	);
}

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
