import authService from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    sendSuccess(res, user, 'User registered', 201);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password, req.ip);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.userId, req.ip);
    sendSuccess(res, null, 'Logged out');
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const result = await authService.refreshToken(req.body.refreshToken, req.ip);
    sendSuccess(res, result, 'Token refreshed');
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    await authService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
    sendSuccess(res, null, 'Password changed');
  } catch (error) {
    next(error);
  }
}

export { register, login, logout, refreshToken, changePassword };
