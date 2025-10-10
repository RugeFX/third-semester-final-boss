import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { z } from "zod";
import { useAppForm } from "@/lib/form";
import { formatIDR, wait } from "@/lib/utils";

export const Route = createFileRoute("/_auth/sign-up/upgrade")({
	component: RouteComponent,
});

const signUpSchema = z.object({
	paymentMethod: z.string().min(3, "Metode pembayaran harus diisi"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

/**
 * Renders the sign-up upgrade route UI for initiating a membership payment.
 *
 * Displays headings, a read-only payment method field, payment summary, and a submit button that, when submitted, navigates to the sign-up success page.
 *
 * @returns The React element for the upgrade route UI.
 */
function RouteComponent() {
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			paymentMethod: "Otomatis",
		} as SignUpForm,
		validators: {
			onChange: signUpSchema,
		},
		onSubmit: async () => {
			await wait(3000);
			navigate({ to: "/sign-up/success" });
		},
	});

	return (
		<motion.div
			className="space-y-8 w-full max-w-md"
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
				transition: {
					duration: 0.5,
					ease: "easeOut",
				},
			}}
		>
			<div className="space-y-6">
				<div className="space-y-3">
					<h1 className="text-5xl font-bold leading-tight text-white">
						Mulai Upgrade ke Membership!
					</h1>
					<p className="text-xl text-tertiary">
						Dengan membership, nikmati kemudahan parkir hanya satu kali klik!
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<form.AppField name="paymentMethod">
					{(field) => (
						<div>
							<field.TextInput
								isRequired
								isDisabled
								label="Metode Pembayaran"
								placeholder="Masukkan Metode Pembayaran Anda"
								wrapperClassName="flex-1 h-full disabled:bg-gray-500 disabled:cursor-default"
								inputClassName="text-primary pointer-events-none"
								className="w-full lg:w-1/2"
							/>
							<field.Errors firstOnly />
						</div>
					)}
				</form.AppField>

				<div className="space-y-2 w-full">
					<h3 className="font-semibold text-md shrink-0">Detail Pembayaran</h3>
					<div className="flex justify-between w-full">
						<span className="block text-base text-primary">
							Total Pembayaran
						</span>
						<span className="block text-base text-bg-brand-solid">
							{formatIDR(100000)}
						</span>
					</div>
				</div>

				<form.AppForm>
					<div className="space-y-2">
						<form.Errors firstOnly />
						<form.SubmitButton
							className="w-full"
							showTextWhileLoading
							isDisabled={false}
						>
							Bayar & Gabung Membership
						</form.SubmitButton>
					</div>
				</form.AppForm>
			</div>
		</motion.div>
	);
}