// File: Server/src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../errors/ApiError';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new AppError(`Validation failed: ${errorMessages.join(', ')}` , 400);
  }
  
  next();
};