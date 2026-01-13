import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/edition/index';
import { validatorCreateEdition } from '../../middleware/validation/edition/validatorCreateEdition';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateEdition], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateEdition], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
