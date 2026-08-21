import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listCustomers, createCustomer } from '../controllers/customerController.js';

const router = Router();

router.get('/', auth, listCustomers);
router.post('/', auth, createCustomer);

export default router;
