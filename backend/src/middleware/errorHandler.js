import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  logger.error(err);
  res.status(statusCode).json({
    success: false,
    message
  });
}

export { errorHandler };
