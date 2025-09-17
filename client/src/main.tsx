import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	// biome-ignore lint/style/noNonNullAssertion: it will be set from the provider
	context: { user: undefined!, queryClient },
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

const root = createRoot(rootElement);
root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
