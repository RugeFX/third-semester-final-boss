import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/members")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.auth.token) {
			toast.error("Silahkan masuk terlebih dahulu!");
			throw redirect({ to: "/sign-in" });
		}

		if (context.auth.user?.type !== "user") {
			toast.error("Akses ditolak", {
				description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
			});
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	return <div>Hello "/members"!</div>;
}
