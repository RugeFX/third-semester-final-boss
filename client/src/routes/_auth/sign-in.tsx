import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/base/buttons/button";
import { useLoginUser } from "@/lib/api/auth/auth";
import { useAppForm } from "@/lib/form";
import { useAuthActions } from "@/lib/store/auth";
import { APP_NAME } from "@/lib/utils/constants";
import { routeTitle } from "@/lib/utils/title";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
	head: () => ({
		meta: [routeTitle("Masuk")],
	}),
});

const signInSchema = z.object({
	username: z
		.string()
		.min(3, "Nama pengguna harus berisi setidaknya 3 karakter"),
	password: z.string().min(8, "Kata sandi harus berisi setidaknya 8 karakter"),
});

type SignInForm = z.infer<typeof signInSchema>;

function RouteComponent() {
	const router = useRouter();
	const { signIn } = useAuthActions();

	const { mutateAsync: signInUser, isPending } = useLoginUser({
		mutation: {
			onSuccess: (data) => {
				signIn(data.data.token, "user");
				router.invalidate().finally(() => {
					router.navigate({ to: "/" });
					toast.success(`Selamat datang di ${APP_NAME}!`);
				});
			},
			onError: ({ response, status }) => {
				if (status === 401) {
					form.setErrorMap({
						onSubmit: {
							fields: {},
							form: {
								message: "Nama pengguna atau kata sandi salah",
							},
						},
					});
					return;
				}

				toast.error("Login gagal", {
					description: response?.data.message,
				});
			},
		},
	});

	const form = useAppForm({
		defaultValues: {
			username: "",
			password: "",
		} as SignInForm,
		validators: {
			onChange: signInSchema,
		},
		onSubmit: ({ value }) => signInUser({ data: value }),
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
					<div className="space-y-2">
						<form.Errors firstOnly />
						<form.SubmitButton
							className="w-full"
							showTextWhileLoading
							isLoading={isPending}
						>
							Masuk
						</form.SubmitButton>
					</div>
				</form.AppForm>

				<div>
					<span className="text-primary">Tidak memiliki akun? </span>
					<Button size="lg" color="link-color" to="/sign-up">
						Daftar
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
