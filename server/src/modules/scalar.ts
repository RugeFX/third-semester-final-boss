// src/modules/scalar.ts (Versi yang Disarankan)

import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Get absolute path
const __filename = fileURLToPath(import.meta.url);
// Get directory name
const __dirname = path.dirname(__filename);

// Combine path
const specFilePath = path.join(__dirname, 'openapi.json');
const specFileContent = fs.readFileSync(specFilePath, 'utf-8');
const apiSpecification = JSON.parse(specFileContent);

router.use('/', apiReference({
    content: apiSpecification
}));

export default router;