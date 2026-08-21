import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listPurchases, createPurchase } from '../controllers/purchaseController.js';

const router = Router();

router.get('/', auth, listPurchases);
router.post('/', auth, createPurchase);

export default router;
