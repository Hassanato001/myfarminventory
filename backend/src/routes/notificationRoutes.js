import { Router } from 'express';
import { createPlaceholderController } from '../controllers/genericController.js';

const router = Router();
router.get('/', createPlaceholderController('notifications'));
export default router;
