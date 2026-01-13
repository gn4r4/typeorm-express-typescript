import { Router } from 'express';
import { CatalogController } from 'controllers/catalog/CatalogController';

const router = Router();
const catalogController = new CatalogController();

router.get('/', catalogController.list);

router.get('/:id', catalogController.show);

export default router;