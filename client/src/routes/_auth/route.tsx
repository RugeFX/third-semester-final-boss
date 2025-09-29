import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";

import authBackground from "@/assets/auth-banner-bg.png";
import signInBanner from "@/assets/sign-in-banner.png";
import signUpBanner from "@/assets/sign-up-banner.png";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.auth.token) throw redirect({ to: "/" });
	},
});

const bannerVariants: Variants = {
	initial: {
		y: "100%",
	},
	animate: {
		y: 0,
		transition: {
			duration: 0.7,
			ease: "easeOut",
		},
	},
	exit: {
		y: "-100%",
		transition: {
			duration: 0.5,
			ease: "easeIn",
		},
	},
};

function RouteComponent() {
	const { pathname } = useLocation();

	return (
		<div className="grid gap-6 items-center px-6 py-7 mx-auto w-full min-h-screen md:container lg:grid-cols-2 sm:px-8 md:px-12 lg:px-16">
			<div className="flex justify-center items-center">
				<Outlet />
			</div>

			<motion.div
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 1,
				}}
				transition={{
					duration: 1,
					ease: "easeOut",
				}}
				className="hidden overflow-hidden relative bg-center bg-no-repeat bg-cover rounded-xl lg:block h-full max-h-[820px]"
				style={{
					backgroundImage: `url(${authBackground})`,
				}}
			>
				<AnimatePresence mode="wait">
					{pathname === "/sign-in" && (
						<motion.img
							key="sign-in"
							className="object-contain object-center absolute top-0 left-0 w-full h-full scale-150 z-1"
							src={signInBanner}
							variants={bannerVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						/>
					)}
					{pathname === "/sign-up" && (
						<motion.img
							key="sign-up"
							className="object-contain object-center absolute top-0 left-0 w-full h-full scale-125 z-1"
							src={signUpBanner}
							variants={bannerVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						/>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
