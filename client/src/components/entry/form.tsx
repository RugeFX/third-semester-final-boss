import { useStore } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import entryBackground from "@/assets/entry-banner-bg.png";
import { Button } from "@/components/base/buttons/button";
import CategoryFieldGroup from "@/components/entry/field-groups/category";
import PlateNumberFieldGroup from "@/components/entry/field-groups/plate-number";
import { useCreateEntryTransaction } from "@/lib/api/transactions/transactions";
import { useAppForm } from "@/lib/form";
import { wait } from "@/lib/utils";
import { cx } from "@/lib/utils/cx";
import LoadingIndicator from "../base/loading-indicator";
import { categories } from "./data";

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

const entryFormSchema = z.object({
	categoryId: z
		.number()
		.positive("Kategori kendaraan harus dipilih")
		.nonoptional("Kategori kendaraan harus dipilih"),
	plateNumber: z.string().nonempty("Plat nomor kendaraan harus diisi"),
});

type EntryForm = z.infer<typeof entryFormSchema>;

export default function EntryForm() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);

	const { mutateAsync } = useCreateEntryTransaction({
		mutation: {
			onError: (error) => {
				toast.error("Terjadi kesalahan saat memproses data.", {
					description: error.message,
				});
			},
			onSuccess: (data) => {
				toast.info("Data", { description: JSON.stringify(data) });
			},
		},
	});

	const form = useAppForm({
		defaultValues: {
			categoryId: categories[0].id,
			plateNumber: "",
		} as EntryForm,
		validators: {
			onChange: entryFormSchema,
		},
		onSubmit: async ({ value }) => {
			await wait(3000);

			// await mutateAsync({
			// 	data: {
			// 		categoryId: value.categoryId,
			// 		plateNumber: value.plateNumber,
			// 		parkingLevelId: 1,
			// 	},
			// });

			navigate({
				to: "/entry/success",
				search: {
					accessCode: "123456",
					categoryId: value.categoryId,
					plateNumber: value.plateNumber,
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
		if (step === 1) setStep(2);
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
					<motion.img
						key={selectedCategory?.id}
						className="object-contain object-right-bottom absolute top-0 left-0 w-full h-full z-1"
						src={selectedCategory?.image}
						variants={bannerItemVariants}
					/>
				</AnimatePresence>
			</motion.div>

			<main className="flex flex-col gap-8 justify-center ml-auto max-w-lg">
				<AnimatePresence mode="wait" initial={false}>
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
						/>
					) : step === 2 ? (
						<PlateNumberFieldGroup
							key={2}
							form={form}
							fields={{ plateNumber: "plateNumber" }}
							name={selectedCategory?.name}
							onPreviousStep={() => {
								if (!isSubmitting) setStep(1);
							}}
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
									Registrasi Kendaraan
								</Button>
							) : step === 2 ? (
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
								<div
									className={cx(
										"rounded-full transition-all duration-500 ease-out h-5",
										step === 1 ? "w-20 bg-brand-500" : "bg-gray-500 w-5",
									)}
								/>
								<div
									className={cx(
										"rounded-full transition-all duration-500 ease-out h-5",
										step === 2 ? "w-20 bg-brand-500" : "bg-gray-500 w-5",
									)}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
}
