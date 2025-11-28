import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/category/index';
import { validatorCreateCategory } from '../../middleware/validation/category/validatorCreateCategory';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id', [checkJwt], show);

// Валідація
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCategory], create);
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCategory], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;