import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import path from 'path';

const router = Router();

const specFilePath = path.join(process.cwd(), 'openapi.json');
const apiSpecification = await import(specFilePath);

router.use('/', apiReference({
    content: apiSpecification
}));

export default router;
