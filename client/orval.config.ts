import "dotenv/config";
import { defineConfig } from "orval";

const API_URL = process.env.VITE_API_URL || "http://localhost:3000";
const SPEC_URL = `${API_URL}/docs/json`;

export default defineConfig({
	api: {
		output: {
			mode: "tags-split",
			target: "src/lib/api",
			schemas: "src/lib/api/models",
			client: "react-query",
			mock: false,
			override: {
				mutator: {
					path: "src/lib/api/mutator/custom-instance.ts",
					name: "customInstance",
				},
				query: {
					useQuery: true,
					useInfinite: true,
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
				},
			},
		},
		hooks: {
			afterAllFilesWrite: "biome check --write",
		},
		input: {
			target: SPEC_URL,
		},
	},
});
