import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/base/buttons/button";
import { useAppForm } from "@/lib/form";
import { wait } from "@/lib/utils";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

const signUpSchema = z
	.object({
		fullName: z
			.string()
			.min(3, "Nama lengkap harus berisi setidaknya 3 karakter"),
		username: z
			.string()
			.min(3, "Nama pengguna harus berisi setidaknya 3 karakter"),
		phoneNumber: z.e164("Nomor telepon harus valid"),
		password: z
			.string()
			.min(8, "Kata sandi harus berisi setidaknya 8 karakter")
			.regex(/[A-Z]/, "Kata sandi harus berisi setidaknya satu huruf besar")
			.regex(/[a-z]/, "Kata sandi harus berisi setidaknya satu huruf kecil")
			.regex(/\d/, "Kata sandi harus berisi setidaknya satu angka")
			.regex(
				/[^\w\s]/,
				"Kata sandi harus berisi setidaknya satu karakter khusus",
			),
		confirmPassword: z
			.string()
			.min(8, "Kata sandi harus berisi setidaknya 8 karakter"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Kata sandi dan konfirmasi kata sandi harus sama",
		path: ["confirmPassword"],
	});

type SignUpForm = z.infer<typeof signUpSchema>;

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			fullName: "",
			username: "",
			phoneNumber: "",
			password: "",
			confirmPassword: "",
		} as SignUpForm,
		onSubmit: async ({ value }) => {
			await wait(3000);
			toast.info("Data", { description: JSON.stringify(value) });
		},
		validators: {
			onChange: signUpSchema,
		},
	});

	return (
		<div className="space-y-4 w-full max-w-md">
			<form.AppField name="fullName">
				{(field) => (
					<div>
						<field.TextInput
							isRequired
							label="Nama Lengkap"
							placeholder="Masukkan Nama Lengkap Anda"
							className="w-full"
							size="md"
						/>
						<field.Errors firstOnly />
					</div>
				)}
			</form.AppField>

			<form.AppField name="username">
				{(field) => (
					<div>
						<field.TextInput
							isRequired
							label="Nama Pengguna"
							placeholder="Masukkan Nama Pengguna Anda"
							className="w-full"
							size="md"
						/>
						<field.Errors firstOnly />
					</div>
				)}
			</form.AppField>

			<form.AppField name="phoneNumber">
				{(field) => (
					<div>
						<field.TextInput
							isRequired
							label="Nomor Telepon"
							placeholder="Masukkan Nomor Telepon Anda"
							className="w-full"
							size="md"
						/>
						<field.Errors firstOnly />
					</div>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<div>
						<field.PasswordInput groupProps={{ isRequired: true }} />
						<field.Errors firstOnly />
					</div>
				)}
			</form.AppField>

			<form.AppField name="confirmPassword">
				{(field) => (
					<div>
						<field.PasswordInput
							groupProps={{ isRequired: true, label: "Ulangi Kata Sandi" }}
							inputProps={{ placeholder: "Ulangi Kata Sandi Anda" }}
						/>
						<field.Errors firstOnly />
					</div>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton className="w-full" showTextWhileLoading>
					Daftar
				</form.SubmitButton>
			</form.AppForm>

			<div>
				<span className="text-primary">Sudah memiliki akun? </span>
				<Button size="lg" color="link-color" to="/sign-in">
					Masuk
				</Button>
			</div>
		</div>
	);
}
