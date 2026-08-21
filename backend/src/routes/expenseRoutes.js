import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listExpenses, createExpense } from '../controllers/expenseController.js';

const router = Router();

router.get('/', auth, listExpenses);
router.post('/', auth, createExpense);

export default router;
