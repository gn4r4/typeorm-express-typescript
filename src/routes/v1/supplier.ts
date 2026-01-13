import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/supplier/index';
import { validatorCreateSupplier } from '../../middleware/validation/supplier/validatorCreateSupplier';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateSupplier], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateSupplier], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
