import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, notFound, RouterProvider } from "@tanstack/react-router";
import { motion } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useStore } from "zustand";

import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";
import { isAxiosError } from "axios";
import LoadingIndicator from "./components/base/loading-indicator";
import authStore from "./lib/store/auth";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, { meta }) => {
			if (
				isAxiosError(error) &&
				error.response?.status === 404 &&
				meta?.throwNotFound
			)
				throw notFound();
		},
	}),
});

function DefaultPendingComponent() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex items-center justify-center flex-col gap-4 h-full"
		>
			<LoadingIndicator />
			<h2 className="font-bold text-2xl">Mohon Tunggu...</h2>
		</motion.div>
	);
}

const router = createRouter({
	routeTree,
	defaultPendingComponent: DefaultPendingComponent,
	// biome-ignore lint/style/noNonNullAssertion: it will be set from the provider
	context: { auth: undefined!, queryClient },
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	const auth = useStore(authStore);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} context={{ auth, queryClient }} />
		</QueryClientProvider>
	);
}

const root = createRoot(rootElement);
root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
