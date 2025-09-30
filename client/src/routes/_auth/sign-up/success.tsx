import { createFileRoute } from "@tanstack/react-router";
import { Check } from "@untitledui/icons";
import { motion } from "motion/react";
import { Button } from "@/components/base/buttons/button";

export const Route = createFileRoute("/_auth/sign-up/success")({
	component: RouteComponent,
});

const MotionCheck = motion(Check);

function RouteComponent() {
	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className="grid gap-4 place-items-center text-center size-full"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.5, ease: "backOut", delay: 0.2 }}
				className="overflow-hidden p-5 rounded-full border-8 bg-brand-700 border-brand-900"
			>
				<MotionCheck
					initial={{ scale: 2, opacity: 0 }}
					animate={{
						scale: 1,
						opacity: 1,
					}}
					transition={{ duration: 0.5, ease: "backOut", delay: 0.4 }}
					className="size-10"
				/>
			</motion.div>
			<h1 className="text-5xl font-bold leading-tight text-white">
				Pembayaran Berhasil!
			</h1>
			<h2 className="text-2xl font-semibold">
				Selamat menikmati kemudahan parkir bersama Pola!
			</h2>
			<Button size="xl" to="/sign-in" className="w-full max-w-lg">
				Masuk ke Membership
			</Button>
		</motion.main>
	);
}
