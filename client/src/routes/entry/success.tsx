import { createFileRoute, redirect } from "@tanstack/react-router";
import { Copy01 } from "@untitledui/icons";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Fragment } from "react";
import { toast } from "sonner";

import entryBackground from "@/assets/entry-banner-bg.png";
import { Button } from "@/components/base/buttons/button";
import { InputBase } from "@/components/base/input/input";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { RemoteSVG } from "@/components/svg/remote-svg";
import {
	getGetCategoryByIdSuspenseQueryOptions,
	useGetCategoryByIdSuspense,
} from "@/lib/api/categories/categories";
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

export const Route = createFileRoute("/entry/success")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	beforeLoad: ({ context }) => {
		const { token, user } = context.auth;
		// TODO: maybe revisit this logic later
		if (!token || user?.type !== "guest") {
			toast.error("Akses ditolak", {
				description: "Anda belum melakukan proses registrasi.",
			});
			throw redirect({ to: "/entry", replace: true });
		}

		return { token };
	},
	loader: async ({ context }) => {
		const { token } = context;

		const { data } = await context.queryClient.ensureQueryData(
			getGetGuestTransactionByAccessCodeQueryOptions(token),
		);

		await context.queryClient.ensureQueryData(
			getGetCategoryByIdSuspenseQueryOptions(data.vehicleDetail.category_id),
		);

		return { accessCode: token };
	},
});

function ErrorComponent() {
	return <div>Error</div>;
}

function RouteComponent() {
	const { accessCode } = Route.useLoaderData();

	const {
		data: { vehicleDetail },
	} = useGetGuestTransactionByAccessCodeSuspense(accessCode, {
		query: { select: ({ data }) => data },
	});

	const { data: category } = useGetCategoryByIdSuspense(
		vehicleDetail.category_id,
		{
			query: { select: ({ data }) => data },
		},
	);

	const onCopyAccessCode = () => {
		navigator.clipboard.writeText(accessCode).then(() => {
			const id = toast.success("Kode akses berhasil disalin!", {
				description:
					"Anda dapat menggunakan kode akses ini untuk melihat status kendaraan anda.",
				action: (
					<Button
						size="sm"
						className="flex-1"
						to="/check"
						onClick={() => toast.dismiss(id)}
					>
						Cek Status
					</Button>
				),
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

			<main className="flex flex-col flex-1 gap-8 justify-center p-10 xl:p-20">
				<div className="space-y-4">
					<h1 className="text-5xl font-bold text-bg-brand-solid">Selamat!</h1>
					<h2 className="text-2xl font-semibold">
						Sekarang, {category.name.toLowerCase()} anda sudah terdaftar!
					</h2>
				</div>

				<div className="flex gap-6">
					<Button
						isDisabled
						size="xl"
						className="flex-1 w-full h-26 max-w-24 group disabled:cursor-default disabled:opacity-100"
					>
						{!!category.icon && (
							<RemoteSVG url={category.icon} className="**:fill-gray-500" />
						)}
						<span className="sr-only">{category.name}</span>
					</Button>

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
						<h3 className="text-xl font-semibold shrink-0">Plat Nomor Kamu</h3>
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
					<PinInput size="lg" className="w-full">
						<PinInput.Group
							maxLength={accessCode.length}
							value={accessCode}
							readOnly
							inputClassName="disabled:cursor-default"
						>
							{Array(accessCode.length)
								.fill(0)
								.map((_, i) => (
									<Fragment key={`slot-${i + 1}`}>
										{i === Math.floor(accessCode.length / 2) && (
											<PinInput.Separator className="text-gray-400" />
										)}
										<PinInput.Slot
											index={i}
											className="w-full bg-gray-500 text-primary ring-0 data-focused:bg-primary_hover"
										/>
									</Fragment>
								))}
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
