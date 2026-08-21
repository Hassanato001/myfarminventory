import { AppError } from '../utils/errors.js';

function validate(schema) {
  return (req, res, next) => {
    const missing = schema.filter((key) => req.body[key] === undefined || req.body[key] === null || req.body[key] === '');
    if (missing.length > 0) {
      next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
      return;
    }
    next();
  };
}

export { validate };
