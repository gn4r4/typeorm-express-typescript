import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/genre/index';
import { validatorCreateGenre } from '../../middleware/validation/genre/validatorCreateGenre';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id', [checkJwt], show);

// Валідація
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateGenre], create);
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateGenre], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;