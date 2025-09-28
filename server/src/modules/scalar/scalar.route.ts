import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import path from 'path';
import fs from 'fs';

const router = Router();

const specFilePath = path.join(process.cwd(), 'openapi.json');
const apiSpecification = JSON.parse(fs.readFileSync(specFilePath, 'utf-8'));

router.use('/', apiReference({
    content: apiSpecification
}));

export default router;