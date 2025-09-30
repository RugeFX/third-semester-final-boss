import "dotenv/config";
import { defineConfig } from "orval";

const API_URL = process.env.VITE_API_URL || "http://localhost:3000";
const SPEC_URL = `${API_URL}/docs/json`;

export default defineConfig({
  api: {
    output: {
      mode: "tags-split",
      target: "src/lib/api/index.ts",
      schemas: "src/lib/api/models",
      client: "react-query",
      mock: true,
      override: {
        mutator: {
          path: "src/lib/api/mutator/custom-instance.ts",
          name: "customInstance",
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
