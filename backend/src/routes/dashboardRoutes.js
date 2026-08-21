import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = Router();

router.get('/summary', auth, getDashboardSummary);

export default router;
