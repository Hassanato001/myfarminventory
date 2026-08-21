import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listSales, createSale } from '../controllers/salesController.js';

const router = Router();

router.get('/', auth, listSales);
router.post('/', auth, createSale);

export default router;
