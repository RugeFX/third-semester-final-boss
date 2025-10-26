import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
export const env = createEnv({
    server: {
        APP_NAME: z.string().min(1).default("Express"),
        APP_PORT: z.coerce.number().default(3000),
        APP_HOST: z.string().min(1).default("0.0.0.0"),
        DB_HOST: z.string().min(1),
        DB_PORT: z.coerce.number().default(5432),
        DB_NAME: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_PASSWORD: z.string().min(1),
        DB_SSL: z
            .enum(["true", "false"])
            .default("false")
            .transform((val) => val === "true"),
        TIGRIS_STORAGE_ACCESS_KEY_ID: z.string().min(1),
        TIGRIS_STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
        TIGRIS_STORAGE_ENDPOINT: z.string().min(1),
        TIGRIS_STORAGE_BUCKET: z.string().min(1),
        JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long for security"),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
//# sourceMappingURL=env.js.map