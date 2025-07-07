// middleware/auth.ts (Enhanced version)
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AppError } from '../errors/ApiError';

export interface AuthenticatedRequestRole extends Request {
  user?: {
    user_id: string;
    email: string;
    role: number;
  };
}

export const requireTeacher = (
  req: AuthenticatedRequestRole,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('Authentication required to access this resource', 401);
  }
  
  if (req.user.role !== 2 ) {
    throw new AppError('Teacher access required to access this resource', 403);
  }
  
  next();
};