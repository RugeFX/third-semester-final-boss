import { useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";
import checkStaff from "@/assets/check-staff.png";
import background from "@/assets/entry-banner-bg.png";
import { getGuestTransactionByAccessCode } from "@/lib/api/transactions/transactions";
import { useAppForm } from "@/lib/form";
import { useAuthActions } from "@/lib/store/auth";
import { wait } from "@/lib/utils";
import LoadingIndicator from "../base/loading-indicator";

const containerVariants: Variants = {
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
	exit: {
		opacity: 0,
	},
};

const checkFormSchema = z.object({
	accessCode: z
		.string()
		.length(6, "Kode akses harus terdiri dari 6 karakter")
		.min(1, "Kode akses harus diisi")
		.regex(
			/^[a-zA-Z0-9]+$/,
			"Kode akses hanya boleh mengandung huruf dan angka",
		)
		.toUpperCase(),
});

type CheckForm = z.infer<typeof checkFormSchema>;

export default function CheckForm() {
	const router = useRouter();
	const { signInAsGuest } = useAuthActions();

	const form = useAppForm({
		defaultValues: {
			accessCode: "",
		} as CheckForm,
		validators: {
			onBlur: checkFormSchema,
		},
		onSubmit: async ({ value }) => {
			// TODO: only for emulating loadiing state, should remove this at some point
			await wait(3000);

			// TODO: is this the correct approach?
			signInAsGuest(value.accessCode);

			await router.invalidate();

			router.navigate("/check/details");
		},
	});

	return (
		<div className="grid grid-cols-2 gap-12 items-center size-full">
			<motion.div
				variants={containerVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="hidden overflow-hidden relative flex-1 bg-top bg-no-repeat bg-cover rounded-xl lg:block h-full min-h-[500px] max-h-[820px]"
				style={{
					backgroundImage: `url(${background})`,
				}}
			>
				<motion.img
					className="object-contain object-right-bottom absolute top-0 left-0 w-full h-full z-1"
					style={{
						filter:
							"drop-shadow(0 1062px 250px rgba(0, 0, 0, 0.02)) drop-shadow(0 680px 250px rgba(0, 0, 0, 0.13)) drop-shadow(0 382px 229px rgba(0, 0, 0, 0.43)) drop-shadow(0 170px 170px rgba(0, 0, 0, 0.72)) drop-shadow(0 42px 93px rgba(0, 0, 0, 0.83))",
					}}
					src={checkStaff}
				/>
			</motion.div>

			<main className="ml-auto max-w-lg">
				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<AnimatePresence mode="wait">
							{isSubmitting ? (
								<motion.div
									key="loading"
									className="flex flex-col gap-8 justify-center items-center text-center"
									variants={containerVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								>
									<LoadingIndicator />
									<h1 className="text-5xl font-bold">Lagi Diperiksa...</h1>
									<h2 className="text-2xl font-semibold">
										Kendaraan anda sedang kami periksa, mohon ditunggu ya!
									</h2>
								</motion.div>
							) : (
								<motion.div
									key="main-form"
									className="flex flex-col gap-4 justify-center w-full"
									variants={containerVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								>
									{/* TODO: change "pagi" to current time (dynamically) */}
									<h1 className="text-5xl font-bold">Halo, Selamat Pagi!</h1>
									<h2 className="text-2xl font-semibold">
										Silahkan masukkan kode akses untuk melihat Status Kendaraan.
									</h2>
									<form.AppField name="accessCode">
										{(field) => (
											<div className="mt-4">
												<field.PinInput
													length={6}
													size="sm"
													groupProps={{
														containerClassName: "h-20",
														onChange: (value) =>
															field.setValue(value.toUpperCase()),
														onKeyUp: (e) => {
															if (e.key === "Enter") form.handleSubmit();
														},
													}}
													slotProps={{ className: "size-full" }}
												/>
												<field.Errors firstOnly />
											</div>
										)}
									</form.AppField>
									<form.AppForm>
										<form.SubmitButton className="w-full" showTextWhileLoading>
											Periksa Kendaraan
										</form.SubmitButton>
									</form.AppForm>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</form.Subscribe>
			</main>
		</div>
	);
}
