import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    next(new AppError('Invalid token', 401));
    return;
  }

  req.user = decoded;
  next();
}

export { auth };
