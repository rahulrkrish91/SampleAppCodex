import jwt from 'jsonwebtoken';
import { AppError } from './errorMiddleware.js';

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return next(new AppError('Authentication token required.', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 401));
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have access to this resource.', 403));
    }
    return next();
  };
}
