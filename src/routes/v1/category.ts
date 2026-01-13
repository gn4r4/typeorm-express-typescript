import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/category/index';
import { validatorCreateCategory } from '../../middleware/validation/category/validatorCreateCategory';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateCategory], create);
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateCategory], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;