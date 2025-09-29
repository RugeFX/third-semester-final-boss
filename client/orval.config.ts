import { defineConfig } from "orval";

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
      target: "./api-spec.json",
    },
  },
});
