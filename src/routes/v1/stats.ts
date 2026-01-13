import { Router } from 'express';
import { getStats } from '../../controllers/dashboard/index';
import { validatorCreateShelf } from '../../middleware/validation/shelf/validatorCreateShelf';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], getStats);

export default router;
