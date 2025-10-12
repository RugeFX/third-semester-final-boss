import { createFileRoute, notFound } from "@tanstack/react-router";
import { Copy01 } from "@untitledui/icons";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { toast } from "sonner";

import entryBackground from "@/assets/entry-banner-bg.png";
import { Button } from "@/components/base/buttons/button";
import { InputBase } from "@/components/base/input/input";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { useGetCategoryByIdSuspense } from "@/lib/api/categories/categories";
import {
	getGetGuestTransactionByAccessCodeQueryOptions,
	useGetGuestTransactionByAccessCodeSuspense,
} from "@/lib/api/transactions/transactions";

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
		x: "100%",
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

export const Route = createFileRoute("/entry/success")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	pendingComponent: PendingComponent,
	loader: ({ context }) => {
		const accessCode = context.auth.token;
		if (!accessCode) {
			console.error("Access code is missing in success page");
			toast.error("Anda harus melakukan proses entry terlebih dahulu.");
			throw notFound();
		}

		context.queryClient.ensureQueryData(
			getGetGuestTransactionByAccessCodeQueryOptions(accessCode),
		);

		return { accessCode };
	},
});

function PendingComponent() {
	return <div>Loading...</div>;
}

function ErrorComponent() {
	return <div>Error</div>;
}

function RouteComponent() {
	const { accessCode } = Route.useLoaderData();

	const {
		data: { vehicleDetail, parkingLevel },
	} = useGetGuestTransactionByAccessCodeSuspense(accessCode, {
		query: { select: ({ data }) => data },
	});

	const { data: category } = useGetCategoryByIdSuspense(
		vehicleDetail.category_id,
		{
			query: { select: ({ data }) => data },
		},
	);

	console.log(vehicleDetail, parkingLevel, category);

	const onCopyAccessCode = () => {
		navigator.clipboard.writeText(accessCode).then(() => {
			toast.success("Kode akses berhasil disalin!", {
				description:
					"Anda dapat menggunakan kode akses ini untuk melihat status kendaraan anda.",
				action: (
					<Button size="sm" className="flex-1">
						Cek Status
					</Button>
				),
				position: "top-center",
			});
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="flex flex-col lg:flex-row items-center bg-gray-700 h-full lg:max-h-[600px] min-h-[500px] rounded-2xl overflow-hidden"
		>
			<motion.div
				variants={bannerContainerVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="overflow-hidden relative flex-1 h-full bg-top bg-no-repeat bg-cover min-w-sm"
				style={{
					backgroundImage: `url(${entryBackground})`,
				}}
			>
				<div className="absolute inset-0 pt-12 pl-12 z-2">
					<h2 className="text-5xl font-bold">{selectedCategory.name}</h2>
				</div>
				<AnimatePresence>
					<motion.img
						key={selectedCategory.id}
						className="object-contain object-right-bottom absolute top-0 left-0 w-full h-full z-1"
						src={selectedCategory.image}
						variants={bannerItemVariants}
					/>
				</AnimatePresence>
			</motion.div>

			<main className="flex flex-col flex-1 gap-8 justify-center p-10 xl:p-20">
				<div className="space-y-4">
					<h1 className="text-5xl font-bold text-bg-brand-solid">Selamat!</h1>
					<h2 className="text-2xl font-semibold">
						Sekarang, motor anda sudah terdaftar!
					</h2>
				</div>

				<div className="flex gap-6">
					<Button
						isDisabled
						size="xl"
						className="flex-1 w-full h-26 max-w-24 group disabled:cursor-default disabled:opacity-100"
					>
						<selectedCategory.icon className="size-14" />
						<span className="sr-only">{selectedCategory.name}</span>
					</Button>

					<div className="flex flex-col flex-1 gap-2 justify-between">
						<h3 className="text-xl font-semibold shrink-0">Tipe Kendaraan</h3>
						<InputBase
							size="xl"
							wrapperClassName="flex-1 h-full bg-gray-500"
							inputClassName="text-primary pointer-events-none"
							value={selectedCategory.name}
							isDisabled
						/>
					</div>

					<div className="flex flex-col flex-1 gap-2 justify-between">
						<h3 className="text-xl font-semibold shrink-0">Plat Nomor Kamu</h3>
						<InputBase
							size="xl"
							wrapperClassName="flex-1 h-full bg-gray-500"
							inputClassName="text-primary pointer-events-none"
							value={plateNumber}
							isDisabled
						/>
					</div>
				</div>

				<div className="space-y-2 w-full">
					<PinInput size="lg" disabled className="w-full">
						<PinInput.Group
							maxLength={6}
							value={accessCode}
							disabled
							readOnly
							inputClassName="disabled:cursor-default"
						>
							<PinInput.Slot
								index={0}
								className="w-full bg-gray-500 text-primary"
							/>
							<PinInput.Slot
								index={1}
								className="w-full bg-gray-500 text-primary"
							/>
							<PinInput.Slot
								index={2}
								className="w-full bg-gray-500 text-primary"
							/>
							<PinInput.Separator className="text-gray-400" />
							<PinInput.Slot
								index={3}
								className="w-full bg-gray-500 text-primary"
							/>
							<PinInput.Slot
								index={4}
								className="w-full bg-gray-500 text-primary"
							/>
							<PinInput.Slot
								index={5}
								className="w-full bg-gray-500 text-primary"
							/>
						</PinInput.Group>
					</PinInput>

					<Button
						size="lg"
						color="link-color"
						className="text-lg font-normal text-primary"
						iconLeading={<Copy01 className="text-bg-brand-solid" />}
						onClick={onCopyAccessCode}
					>
						Salin kode akses untuk melihat Status Kendaraan
					</Button>
				</div>
			</main>
		</motion.div>
	);
}
