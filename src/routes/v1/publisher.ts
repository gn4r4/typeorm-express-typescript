import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/publisher/index';
import { validatorCreatePublisher } from '../../middleware/validation/publisher/validatorCreatePublisher';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreatePublisher], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreatePublisher], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
