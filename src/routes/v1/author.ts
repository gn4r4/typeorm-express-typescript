import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/author';
import { checkJwt } from '../../middleware/checkJwt'; // Якщо потрібна авторизація
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], create);

router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);
export default router;