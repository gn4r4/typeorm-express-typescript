import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/employee/index';
import { validatorCreateEmployee } from '../../middleware/validation/employee/validatorCreateEmployee';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateEmployee], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateEmployee], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
