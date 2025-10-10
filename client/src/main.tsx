import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useStore } from "zustand";

import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";
import authStore from "./lib/store/auth";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	// biome-ignore lint/style/noNonNullAssertion: it will be set from the provider
	context: { auth: undefined!, queryClient },
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

/**
 * Root application component that supplies react-query and router context to the app.
 *
 * @returns The root React element tree containing `QueryClientProvider` and `RouterProvider` configured with `auth` and `queryClient`.
 */
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