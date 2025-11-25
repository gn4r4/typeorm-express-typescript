import { Router } from 'express';
import { list, show, create, edit, destroy } from '../../controllers/book/index';
// import { checkJwt } from '../../middleware/checkJwt'; // Якщо потрібна авторизація
// import { validator } from '../../middleware/validator'; // Якщо є валідація DTO

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show); // Валідація ID через RegEx
router.post('/', create);
router.patch('/:id([0-9]+)', edit);
router.delete('/:id([0-9]+)', destroy);

export default router;