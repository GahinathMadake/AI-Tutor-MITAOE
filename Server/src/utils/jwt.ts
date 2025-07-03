import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { JWTPayload } from '../middleware/auth';

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
};