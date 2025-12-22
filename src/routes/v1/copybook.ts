import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/copybook/index';
import { validatorCreateCopybook } from '../../middleware/validation/copybook/validatorCreateCopybook';
import { validatorUpdateCopybook } from '../../middleware/validation/copybook/validatorUpdateCopybook';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id([0-9]+)', [checkJwt], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCopybook], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorUpdateCopybook], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
