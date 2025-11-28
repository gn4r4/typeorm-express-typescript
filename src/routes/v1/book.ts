import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/book/index';
import { validatorCreateBook } from '../../middleware/validation/book/validatorCreateBook';
import { checkJwt } from '../../middleware/checkJwt'; // Якщо потрібна авторизація
import { checkRole } from '../../middleware/checkRole';
// import { validator } from '../../middleware/validator'; // Якщо є валідація DTO

const router = Router();

router.get('/', [checkJwt], list);
router.get('/:id', [checkJwt], show);

// Валідація перед створенням
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateBook], create);

// Валідація перед редагуванням
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateBook], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;