import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/lending/index';
import { validatorCreateLending } from '../../middleware/validation/lending/validatorCreateLending';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateLending], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateLending], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
