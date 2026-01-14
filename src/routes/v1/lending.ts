import { Router } from 'express';
import { list, show, create, edit, destroy, history } from '../../controllers/lending/index';
import { validatorCreateLending } from '../../middleware/validation/lending/validatorCreateLending';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/my-history', [checkJwt], history);

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateLending], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateLending], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
