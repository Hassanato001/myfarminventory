import { Router } from 'express';
import authService from '../services/authService.js';
import { auth } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const users = await authService.getUsers(req.query);
    sendSuccess(res, users, 'Users retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
