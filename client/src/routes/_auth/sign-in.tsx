import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/base/buttons/button";
import MainIcon from "@/components/foundations/app-icons/main-icon";
import { useAppForm } from "@/lib/form";
import { wait } from "@/lib/utils";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
});

const signInSchema = z.object({
	username: z
		.string()
		.min(3, "Nama pengguna harus berisi setidaknya 3 karakter"),
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
});

type SignInForm = z.infer<typeof signInSchema>;

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			username: "",
			password: "",
		} as SignInForm,
		onSubmit: async ({ value }) => {
			await wait(3000);
			toast.info("Data", { description: JSON.stringify(value) });
		},
		validators: {
			onChange: signInSchema,
		},
	});

	return (
		<div className="space-y-8 w-full max-w-md">
			<div className="space-y-6">
				<MainIcon className="size-24 fill-brand-500" />

				<div className="space-y-3">
					<h1 className="text-5xl font-bold leading-tight text-white">
						Parkir lebih cepat,
						<br />
						hidup lebih mudah.
					</h1>
					<p className="text-xl text-tertiary">
						Dengan Kami, Anda bisa melakukan parkir cuma dari genggaman tangan
						Anda.
					</p>
				</div>
			</div>

			<div className="space-y-4">
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

				<form.AppField name="password">
					{(field) => (
						<div>
							<field.PasswordInput groupProps={{ isRequired: true }} />
							<field.Errors firstOnly />
						</div>
					)}
				</form.AppField>

				<div className="text-right">
					<Button color="link-color" size="lg">
						Lupa kata sandi?
					</Button>
				</div>

				<form.AppForm>
					<form.SubmitButton className="w-full" showTextWhileLoading>
						Masuk
					</form.SubmitButton>
				</form.AppForm>

				<div>
					<span className="text-primary">Tidak memiliki akun? </span>
					<Button size="lg" color="link-color" to="/sign-up">
						Daftar
					</Button>
				</div>
			</div>
		</div>
	);
}
