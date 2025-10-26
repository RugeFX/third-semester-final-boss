import { Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import path from "path";
import fs from "fs";
const router = Router();
const specFilePath = path.join(process.cwd(), "openapi.json");
const apiSpecification = JSON.parse(fs.readFileSync(specFilePath, "utf-8"));
router.get("/", apiReference({
    content: apiSpecification,
}));
router.get("/json", (_req, res) => res.json(apiSpecification));
export default router;
//# sourceMappingURL=scalar.route.js.map