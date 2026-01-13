import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/reader/index';
// import { validatorCreateShelf } from '../../middleware/validation/shelf/validatorCreateShelf';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
