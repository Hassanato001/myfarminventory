import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { register, login, logout, refreshToken, changePassword } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', auth, logout);
router.post('/change-password', auth, changePassword);

export default router;
