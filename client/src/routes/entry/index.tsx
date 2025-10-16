import { createFileRoute, redirect } from "@tanstack/react-router";

import EntryForm from "@/components/entry/form";
import {
	getListCategoriesQueryOptions,
	useListCategoriesSuspense,
} from "@/lib/api/categories/categories";
import {
	getListParkingLevelsQueryOptions,
	useListParkingLevelsSuspense,
} from "@/lib/api/parking-levels/parking-levels";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/entry/")({
	component: RouteComponent,
	head: () => ({
		meta: [routeTitle("Masuk Kendaraan")],
	}),
	beforeLoad: ({ context }) => {
		if (context.auth.token)
			throw redirect({
				to: "/",
			});
	},
	loader: ({ context }) => {
		context.queryClient
			.ensureQueryData(getListCategoriesQueryOptions())
			.then(({ data }) => {
				data.forEach((category) => {
					// preload thumbnail images cuz they are slow as heck to load
					new Image().src = category.thumbnail ?? "";
				});
			});
		context.queryClient.ensureQueryData(getListParkingLevelsQueryOptions());
	},
});

function RouteComponent() {
	const { data: categories } = useListCategoriesSuspense({
		query: { select: ({ data }) => data },
	});

	const { data: parkingLevels } = useListParkingLevelsSuspense({
		query: { select: ({ data }) => data },
	});

	return <EntryForm categories={categories} parkingLevels={parkingLevels} />;
}
