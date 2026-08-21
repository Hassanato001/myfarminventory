import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getSummary } from '../controllers/reportController.js';

const router = Router();

router.get('/summary', auth, getSummary);

export default router;
