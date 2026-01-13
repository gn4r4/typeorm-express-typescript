import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/location/index';
import { checkJwt } from '../../middleware/checkJwt'; // Якщо потрібна авторизація
import { checkRole } from '../../middleware/checkRole';
// import { validator } from '../../middleware/validator'; // Якщо є валідація DTO

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN', 'RESTORER'])], list);
router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR', 'LIBRARIAN', 'RESTORER'])], show);

// Валідація перед створенням
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR'])], create);

// Валідація перед редагуванням
router.patch('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'RESTORER'])], edit);

router.delete('/:id', [checkJwt, checkRole(['ADMINISTRATOR', 'RESTORER'])], destroy);

export default router;