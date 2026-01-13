import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/genre/index';
import { validatorCreateGenre } from '../../middleware/validation/genre/validatorCreateGenre';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateGenre], create);
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateGenre], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;