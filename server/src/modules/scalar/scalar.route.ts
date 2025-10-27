import "dotenv/config";
import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import path from "path";
import fs from "fs";

const SERVER_URL = process.env.SERVER_BASE_URL || "http://localhost:3000";

const router = Router();

const specFilePath = path.join(process.cwd(), "openapi.json");
const apiSpecification = JSON.parse(fs.readFileSync(specFilePath, "utf-8"));

// Dynamically set the server URL from environment variable
apiSpecification.servers = [
  {
    url: SERVER_URL,
    description: "Dynamic Server URL (from .env)"
  }
];

router.get(
  "/",
  apiReference({
    content: apiSpecification,
  })
);

router.get("/json", (_req, res) => res.json(apiSpecification));

export default router;
