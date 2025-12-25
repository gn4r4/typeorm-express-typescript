import { Router } from 'express';

import auth from './auth';
import users from './users';
import book from './book';
import author from './author';     
import category from './category'; 
import genre from './genre';
import publisher from './publisher';
import position from './position';
import employee from './employee';
import cabinet from './cabinet';
import edition from './edition';
import copybook from './copybook';
import shelf from './shelf';
import lending from './lending';
import orders from './orders';
import location from './location';
import reader from './reader';
import supplier from './supplier';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/books', book);
router.use('/authors', author);       
router.use('/categories', category);  
router.use('/genres', genre);
router.use('/publishers', publisher);
router.use('/positions', position);
router.use('/employees', employee);
router.use('/cabinets', cabinet);
router.use('/editions', edition);
router.use('/copybooks', copybook);
router.use('/shelves', shelf);
router.use('/lendings', lending);
router.use('/orders', orders);
router.use('/locations', location);
router.use('/readers', reader);
router.use('/suppliers', supplier);


export default router;