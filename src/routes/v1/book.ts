import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/book/index';
import { validatorCreateBook } from '../../middleware/validation/book/validatorCreateBook';
import { validatorEditBook } from '../../middleware/validation/book/validatorEditBook';
import { checkJwt } from '../../middleware/checkJwt'; // Якщо потрібна авторизація
import { checkRole } from '../../middleware/checkRole';
// import { validator } from '../../middleware/validator'; // Якщо є валідація DTO

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);

// Валідація перед створенням
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorCreateBook], create);

// Валідація перед редагуванням
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN']), validatorEditBook], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN'])], destroy);

export default router;