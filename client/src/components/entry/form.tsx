import { useStore } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "@untitledui/icons";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import entryBackground from "@/assets/entry-banner-bg.png";
import { Button } from "@/components/base/buttons/button";
import CategoryFieldGroup from "@/components/entry/field-groups/category";
import PlateNumberFieldGroup from "@/components/entry/field-groups/plate-number";
import type { Category, ParkingLevel } from "@/lib/api/models";
import { useCreateEntryTransaction } from "@/lib/api/transactions/transactions";
import { useAppForm } from "@/lib/form";
import { useAuthActions } from "@/lib/store/auth";
import { wait } from "@/lib/utils";
import { cx } from "@/lib/utils/cx";
import LoadingIndicator from "../base/loading-indicator";
import ParkingLevelFieldGroup from "./field-groups/parking-level";

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

const fieldGroupVariants: Variants = {
	enter: (direction: number) => ({
		x: direction > 0 ? "20%" : "-20%",
		opacity: 0,
	}),
	animate: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: "easeOut",
		},
	},
	exit: (direction: number) => ({
		x: direction < 0 ? "20%" : "-20%",
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: "easeIn",
		},
	}),
};

const entryFormSchema = z.object({
	categoryId: z
		.number()
		.positive("Kategori kendaraan harus dipilih")
		.nonoptional("Kategori kendaraan harus dipilih"),
	parkingLevelId: z.coerce
		.number<number>()
		.positive("Lokasi parkir harus dipilih")
		.nonoptional("Lokasi parkir harus dipilih"),
	plateNumber: z.string().nonempty("Plat nomor kendaraan harus diisi"),
});

type EntryForm = z.infer<typeof entryFormSchema>;

const TOTAL_STEPS = 3;

const MotionButton = motion.create(Button);

interface EntryFormProps {
	categories: Category[];
	parkingLevels: ParkingLevel[];
}

export default function EntryForm({
	categories,
	parkingLevels,
}: EntryFormProps) {
	const router = useRouter();

	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState<1 | -1>(1);

	const { signInAsGuest } = useAuthActions();

	const { mutateAsync } = useCreateEntryTransaction({
		mutation: {
			onError: (error) => {
				toast.error("Terjadi kesalahan saat memproses data.", {
					description: error.message,
				});
			},
			onSuccess: ({ data }) => {
				signInAsGuest(data.access_code);

				router.invalidate().finally(() => {
					router.navigate({
						to: "/entry/success",
					});
				});
			},
		},
	});

	const form = useAppForm({
		defaultValues: {
			categoryId: categories[0].id,
			parkingLevelId: parkingLevels[0].id,
			plateNumber: "",
		} as EntryForm,
		validators: {
			onChange: entryFormSchema,
		},
		onSubmit: async ({ value }) => {
			// TODO: should remove this at some point
			await wait(3000);

			await mutateAsync({
				data: {
					categoryId: value.categoryId,
					plateNumber: value.plateNumber,
					parkingLevelId: Number(value.parkingLevelId),
				},
			});
		},
	});

	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

	const selectedCategoryId = useStore(
		form.store,
		(state) => state.values.categoryId,
	);

	const selectedCategory = categories.find(
		(category) => category.id === selectedCategoryId,
	);

	const handleNextStep = () => {
		setDirection(1);
		if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
	};

	const handlePreviousStep = () => {
		setDirection(-1);
		if (step > 1) setStep((prev) => prev - 1);
	};

	return (
		<div className="grid grid-cols-2 gap-12 items-center size-full">
			<motion.div
				variants={bannerContainerVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="hidden overflow-hidden relative flex-1 bg-top bg-no-repeat bg-cover rounded-xl lg:block h-full min-h-[500px] max-h-[820px]"
				style={{
					backgroundImage: `url(${entryBackground})`,
				}}
			>
				<div className="absolute inset-0 pt-12 pl-12 z-2">
					<h2 className="text-5xl font-bold">{selectedCategory?.name}</h2>
				</div>
				<AnimatePresence>
					{selectedCategory?.thumbnail && (
						<motion.img
							key={selectedCategory.id}
							className="object-contain object-right-bottom absolute top-0 left-0 w-full h-full z-1"
							style={{
								filter:
									"drop-shadow(0 1062px 250px rgba(0, 0, 0, 0.02)) drop-shadow(0 680px 250px rgba(0, 0, 0, 0.13)) drop-shadow(0 382px 229px rgba(0, 0, 0, 0.43)) drop-shadow(0 170px 170px rgba(0, 0, 0, 0.72)) drop-shadow(0 42px 93px rgba(0, 0, 0, 0.83))",
							}}
							src={selectedCategory.thumbnail}
							variants={bannerItemVariants}
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>
					)}
				</AnimatePresence>
			</motion.div>

			<main className="flex flex-col gap-8 justify-center ml-auto max-w-lg">
				<AnimatePresence>
					{step > 1 && !isSubmitting ? (
						<MotionButton
							key="back-button"
							onClick={handlePreviousStep}
							size="xl"
							color="secondary"
							className={"w-max aspect-square"}
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							iconLeading={<ChevronLeft className="size-8" />}
						/>
					) : null}
				</AnimatePresence>

				<AnimatePresence mode="wait" initial={false} custom={direction}>
					{isSubmitting ? (
						<motion.div
							className="flex flex-col gap-8 justify-center items-center text-center"
							variants={bannerContainerVariants}
							initial="initial"
							animate="animate"
							exit={{
								opacity: 0,
							}}
						>
							<LoadingIndicator />
							<h1 className="text-5xl font-bold">Kode akses dibuat</h1>
							<h2 className="text-2xl font-semibold">
								Kami sedang menyiapkan kode akses kendaraan anda.
							</h2>
						</motion.div>
					) : step === 1 ? (
						<CategoryFieldGroup
							key={1}
							form={form}
							fields={{ categoryId: "categoryId" }}
							categories={categories}
							variants={fieldGroupVariants}
							direction={direction}
						/>
					) : step === 2 ? (
						<ParkingLevelFieldGroup
							key={2}
							form={form}
							fields={{ parkingLevelId: "parkingLevelId" }}
							name={selectedCategory?.name}
							parkingLevels={parkingLevels}
							variants={fieldGroupVariants}
							direction={direction}
						/>
					) : step === 3 ? (
						<PlateNumberFieldGroup
							key={3}
							form={form}
							fields={{ plateNumber: "plateNumber" }}
							name={selectedCategory?.name}
							variants={fieldGroupVariants}
							direction={direction}
						/>
					) : (
						<div className="flex flex-col gap-8 justify-center">
							<h1 className="text-5xl font-bold">Waduh</h1>
							<h2 className="text-2xl font-semibold">
								Terjadi kesalahan saat memproses data.
							</h2>
						</div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{!isSubmitting && (
						<motion.div
							key="actions"
							variants={bannerContainerVariants}
							initial="initial"
							animate="animate"
							exit={{
								opacity: 0,
							}}
							className="space-y-8"
						>
							{step === 1 ? (
								<Button size="xl" className="w-full" onClick={handleNextStep}>
									Lanjutkan
								</Button>
							) : step === 2 ? (
								<Button size="xl" className="w-full" onClick={handleNextStep}>
									Registrasi Kendaraan
								</Button>
							) : step === TOTAL_STEPS ? (
								<form.AppForm>
									<form.SubmitButton className="w-full" showTextWhileLoading>
										Mulai Parkir
									</form.SubmitButton>
								</form.AppForm>
							) : (
								<Button size="xl" className="w-full" onClick={() => setStep(1)}>
									Kembali
								</Button>
							)}

							<div className="flex gap-4 items-center">
								{Array.from({ length: TOTAL_STEPS }).map((_, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: these are just static dots
										key={`dot-${index}`}
										className={cx(
											"rounded-full transition-all duration-500 ease-out h-5",
											step === index + 1
												? "w-20 bg-brand-500"
												: "bg-gray-500 w-5",
										)}
									/>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
}
