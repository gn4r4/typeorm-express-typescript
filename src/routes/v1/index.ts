import { Router } from 'express';

import auth from './auth';
import users from './users';
import book from './book';
import author from './author';     
import category from './category'; 
import genre from './genre';       

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/books', book);
router.use('/authors', author);       
router.use('/categories', category);  
router.use('/genres', genre);         

export default router;