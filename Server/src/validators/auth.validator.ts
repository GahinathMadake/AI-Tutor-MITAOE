import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/ApiError';

export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

export const validateToken = body('token')
  .isString()
  .notEmpty()
  .withMessage('Token is required');

export const validateCompleteSignup = [
  body('stytch_user_id').isString().notEmpty().withMessage('Stytch user ID is required'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('prn').isString().notEmpty().withMessage('PRN is required'),
  body('role').optional().isInt({ min: 1, max: 3 }).withMessage('Role must be 1, 2, or 3'),
  body('school').optional().isString().withMessage('School must be a string')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }
  next();
};