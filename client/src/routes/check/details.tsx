import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useMemo } from "react";

import bikeAccent from "@/assets/bike-accent.png";
import entryBackground from "@/assets/entry-banner-bg.png";
import { Button } from "@/components/base/buttons/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "@/components/base/dialog/dialog";
import { InputBase } from "@/components/base/input/input";
import {
	getGetCategoryByIdQueryOptions,
	useGetCategoryByIdSuspense,
} from "@/lib/api/categories/categories";
import {
	getGetGuestTransactionByAccessCodeQueryOptions,
	useGetGuestTransactionByAccessCodeSuspense,
} from "@/lib/api/transactions/transactions";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import { useAuthActions } from "@/lib/store/auth";
import { formatIDR } from "@/lib/utils";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/check/details")({
	head: () => ({
		meta: [routeTitle("Detail Kendaraan")],
	}),
	errorComponent: ErrorComponent,
	notFoundComponent: NotFoundComponent,
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		const { token, user } = context.auth;
		if (!token || user?.type !== "guest")
			throw redirect({ to: "/check", replace: true });

		return { accessCode: token };
	},
	loader: async ({ context }) => {
		const { data } = await context.queryClient.ensureQueryData(
			getGetGuestTransactionByAccessCodeQueryOptions(context.accessCode, {
				query: { meta: { throwNotFound: true } },
			}),
		);

		await context.queryClient.ensureQueryData(
			getGetCategoryByIdQueryOptions(data.vehicleDetail.category_id),
		);

		return { accessCode: context.accessCode };
	},
});

function ErrorComponent() {
	const router = useRouter();
	const queryErrorResetBoundary = useQueryErrorResetBoundary();

	const { signOut } = useAuthActions();

	useEffect(() => {
		queryErrorResetBoundary.reset();
	}, [queryErrorResetBoundary]);

	const onGoBack = () => {
		signOut();
		router.invalidate().then(() => router.navigate({ to: "/check" }));
	};

	return (
		<div className="flex grow flex-col items-center justify-center gap-4 p-4 max-w-lg mx-auto text-center">
			<h1 className="text-5xl font-bold ">Terjadi kesalahan</h1>
			<p className="text-2xl font-semibold">
				Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.
			</p>
			<Button size="xl" className="w-full mt-4" onClick={onGoBack}>
				Kembali
			</Button>
		</div>
	);
}

function NotFoundComponent() {
	const { signOut } = useAuthActions();
	const router = useRouter();

	const onGoBack = () => {
		signOut();
		router.invalidate().then(() => router.navigate({ to: "/check" }));
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { duration: 1 } }}
			className="flex flex-col items-center justify-center gap-4 p-4 max-w-lg mx-auto text-center"
		>
			<img
				src={bikeAccent}
				alt="Bike Accent"
				className="h-64"
				role="presentation"
			/>
			<h1 className="text-5xl font-bold ">Kendaraan tidak ditemukan</h1>
			<p className="text-2xl font-semibold">
				Hmmm, sepertinya kode akses yang kamu masukkan salah...
			</p>
			<Button size="xl" className="w-full mt-4" onClick={onGoBack}>
				Kembali
			</Button>
		</motion.div>
	);
}

const bannerContainerVariants: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: {
			duration: 1,
			ease: "easeOut",
		},
	},
};

const bannerItemVariants: Variants = {
	initial: {
		opacity: 1,
		x: "400%",
	},
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 1,
			ease: "circOut",
		},
	},
};

const TimeRow = ({ digit }: { digit: string | number }) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.5, ease: "easeOut" }}
		key={digit}
		className="flex items-center justify-center rounded-xl bg-gray-500 text-center text-primary px-2 py-0.5 text-display-lg font-medium size-full"
	>
		{digit}
	</motion.div>
);

function RouteComponent() {
	const { accessCode } = Route.useLoaderData();

	const router = useRouter();
	const { signOut } = useAuthActions();

	const {
		data: { vehicleDetail, created_at },
	} = useGetGuestTransactionByAccessCodeSuspense(accessCode, {
		query: { select: ({ data }) => data },
	});

	const { data: category } = useGetCategoryByIdSuspense(
		vehicleDetail.category_id,
		{
			query: { select: ({ data }) => data },
		},
	);

	const enteredDate = useMemo(() => new Date(created_at), [created_at]);

	const { hours, minutes, seconds } = useElapsedTime(enteredDate);

	const onGoBack = () => {
		signOut();

		router.invalidate().then(() => router.navigate({ to: "/check" }));
	};

	const onEndSession = () => {};

	const formattedEnteredDate = format(enteredDate, "hh.mm a - dd MMMM yyyy");
	const paddedHours = String(hours % 100).padStart(2, "0");
	const paddedMinutes = String(minutes).padStart(2, "0");
	const paddedSeconds = String(seconds).padStart(2, "0");

	return (
		<div className="container grid px-6 py-7 mx-auto size-full sm:px-8 md:px-12 lg:px-16">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex flex-col lg:flex-row items-center bg-gray-700 rounded-2xl overflow-hidden"
			>
				<motion.div
					variants={bannerContainerVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					className="overflow-hidden self-stretch relative bg-top bg-no-repeat bg-cover min-w-md"
					style={{
						backgroundImage: `url(${entryBackground})`,
					}}
				>
					<div className="absolute inset-0 pt-12 px-12 z-2">
						<h2 className="text-5xl font-bold">{category.name}</h2>
					</div>
					<AnimatePresence>
						<motion.img
							key={category.id}
							className="object-contain object-right-bottom absolute top-20 left-0 size-full scale-120 z-1"
							src={category.thumbnail}
							role="presentation"
							variants={bannerItemVariants}
						/>
					</AnimatePresence>
				</motion.div>

				<main className="flex flex-col flex-1 gap-8 justify-center py-12 px-10 xl:px-10">
					<div className="space-y-4">
						<h1 className="text-5xl font-bold text-bg-brand-solid">
							Detail Kendaraan Anda
						</h1>
					</div>

					<div className="flex gap-6">
						<div className="flex flex-col flex-1 gap-2 justify-between">
							<h3 className="text-xl font-semibold shrink-0">Tipe Kendaraan</h3>
							<InputBase
								size="xl"
								wrapperClassName="flex-1 h-full bg-gray-500"
								inputClassName="text-primary pointer-events-none"
								value={category.name}
								isReadOnly
							/>
						</div>

						<div className="flex flex-col flex-1 gap-2 justify-between">
							<h3 className="text-xl font-semibold shrink-0">
								Plat Nomor Kamu
							</h3>
							<InputBase
								size="xl"
								wrapperClassName="flex-1 h-full bg-gray-500"
								inputClassName="text-primary pointer-events-none"
								value={vehicleDetail.plate_number}
								isReadOnly
							/>
						</div>
					</div>

					<div className="space-y-2 w-full">
						<h3 className="text-xl font-semibold shrink-0">
							{formattedEnteredDate}
						</h3>
						<div className="flex items-center gap-2 h-20">
							<TimeRow digit={paddedHours[0]}></TimeRow>
							<TimeRow digit={paddedHours[1]}></TimeRow>
							<span className="text-5xl font-bold text-primary">:</span>
							<TimeRow digit={paddedMinutes[0]}></TimeRow>
							<TimeRow digit={paddedMinutes[1]}></TimeRow>
							<span className="text-5xl font-bold text-primary">:</span>
							<TimeRow digit={paddedSeconds[0]}></TimeRow>
							<TimeRow digit={paddedSeconds[1]}></TimeRow>
						</div>
					</div>

					<div className="flex flex-col gap-2 justify-between">
						<h3 className="text-xl font-semibold shrink-0">Biaya Parkir</h3>
						<p className="text-5xl font-bold text-bg-brand-solid">
							{/* TODO: replace with real calculation */}
							{formatIDR(999999)}
						</p>
					</div>

					<div className="flex w-full gap-4 justify-stretch">
						<Button
							size="xl"
							color="secondary"
							className="h-14 w-full"
							onClick={onGoBack}
						>
							Kembali
						</Button>
						<DialogTrigger>
							<Button size="xl" className="h-14 w-full" onClick={onEndSession}>
								Akhiri Parkir
							</Button>

							<DialogOverlay isDismissable={false}>
								<DialogContent
									role="alertdialog"
									closeButton={false}
									className="sm:max-w-[425px]"
								>
									{({ close }) => (
										<>
											<DialogHeader>
												<DialogTitle>Akhiri Sesi Parkir</DialogTitle>
											</DialogHeader>
											<DialogDescription>
												Apakah anda yakin ingin mengakhiri sesi parkir
											</DialogDescription>
											<DialogFooter>
												<Button
													color="secondary"
													className="w-full"
													onClick={close}
												>
													Batal
												</Button>
												<Button className="w-full">Akhiri</Button>
											</DialogFooter>
										</>
									)}
								</DialogContent>
							</DialogOverlay>
						</DialogTrigger>
					</div>
				</main>
			</motion.div>
		</div>
	);
}
