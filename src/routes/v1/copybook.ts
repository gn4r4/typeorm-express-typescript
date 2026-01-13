import { createJwtToken } from './../../utils/createJwtToken';
import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/copybook/index';
import { validatorCreateCopybook } from '../../middleware/validation/copybook/validatorCreateCopybook';
import { validatorUpdateCopybook } from '../../middleware/validation/copybook/validatorUpdateCopybook';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN', 'RESTORER'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN', 'RESTORER'])], show);

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateCopybook], create);
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN', 'RESTORER']), validatorUpdateCopybook], edit);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;
