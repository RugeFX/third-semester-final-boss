import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { ArrowLeft } from "@untitledui/icons";
import { AnimatePresence, motion, type Variants } from "motion/react";
import authBackground from "@/assets/auth-banner-bg.png";
import upgradeBanner from "@/assets/membership-card.png";
import signInBanner from "@/assets/sign-in-banner.png";
import signUpBanner from "@/assets/sign-up-banner.png";
import { Button } from "@/components/base/buttons/button";
import MainIcon from "@/components/foundations/app-icons/main-icon";
import { APP_NAME } from "@/lib/utils/constants";
import { cx } from "@/lib/utils/cx";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.auth.token && context.auth.user?.type === "user")
			throw redirect({ to: "/" });
	},
});

function Header() {
	return (
		<header className="container flex justify-between items-center px-6 py-7 mx-auto w-full sm:px-8 md:px-12 lg:px-16">
			<Link to="/entry" className="flex gap-3 items-center">
				<MainIcon className="size-16 fill-brand-500" />
				<h3 className="text-3xl font-bold">{APP_NAME}</h3>
			</Link>
			<div className="flex gap-4 items-center">
				<Button
					color="primary-destructive"
					size="xl"
					to="/entry"
					iconLeading={ArrowLeft}
				>
					Kembali
				</Button>
			</div>
		</header>
	);
}

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

const scaleVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.5,
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		scale: 0.5,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	},
};

function RouteComponent() {
	const { pathname } = useLocation();

	return (
		<div className="flex flex-col min-h-screen size-full">
			{/* TODO: nasty ahh checks, fix pls */}
			{pathname !== "/sign-up/success" && <Header />}
			<div
				className={cx(
					"grid flex-1 gap-6 items-center px-6 py-7 mx-auto w-full h-full md:container lg:grid-cols-2 sm:px-8 md:px-12 lg:px-16",
					pathname === "/sign-up/success" && "!grid-cols-1",
				)}
			>
				<div className="flex justify-between items-center">
					<Outlet />
				</div>

				{pathname !== "/sign-up/success" && (
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
							{pathname === "/sign-in" ? (
								<motion.img
									key="sign-in"
									className="object-contain object-center absolute top-0 left-0 w-full h-full scale-150 z-1"
									src={signInBanner}
									variants={bannerVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								/>
							) : pathname === "/sign-up" ? (
								<motion.img
									key="sign-up"
									className="object-contain object-center absolute top-0 left-0 w-full h-full scale-125 z-1"
									src={signUpBanner}
									variants={bannerVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								/>
							) : pathname === "/sign-up/upgrade" ? (
								<motion.img
									key="upgrade"
									className="object-contain object-center absolute top-0 left-0 w-full h-full scale-200 z-1"
									src={upgradeBanner}
									variants={scaleVariants}
									initial="initial"
									animate="animate"
									exit="exit"
								/>
							) : null}
						</AnimatePresence>
					</motion.div>
				)}
			</div>
		</div>
	);
}
