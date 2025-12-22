import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/reader/index';
// import { validatorCreateShelf } from '../../middleware/validation/shelf/validatorCreateShelf';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR'])], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
