import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/cabinet/index';
import { validatorCreateCabinet } from '../../middleware/validation/cabinet/validatorCreateCabinet';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCabinet], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCabinet], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
