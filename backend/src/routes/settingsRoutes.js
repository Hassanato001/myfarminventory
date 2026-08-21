import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);

export default router;
