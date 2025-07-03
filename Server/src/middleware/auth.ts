// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { stytchClient } from '../config/stytch';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { User, AuthenticatedRequest } from '../types/auth';

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    
    // Optionally verify with Stytch (for extra security)
    try {
      const stytchUser = await stytchClient.users.get({ user_id: decoded.userId });
      
      const user: User = {
        id: stytchUser.user_id,
        email: stytchUser.emails[0]?.email || decoded.email,
        name: stytchUser.name?.first_name && stytchUser.name?.last_name 
          ? `${stytchUser.name.first_name} ${stytchUser.name.last_name}`
          : undefined,
        created_at: stytchUser.created_at || new Date().toISOString(),
        status: (stytchUser.status as User['status']) || 'active',
      };

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (stytchError) {
      logger.warn('Stytch user verification failed', { error: stytchError, userId: decoded.userId });
      // Continue with JWT data if Stytch fails (graceful degradation)
      (req as AuthenticatedRequest).user = {
        id: decoded.userId,
        email: decoded.email,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      next();
    }
  } catch (error) {
    logger.error('Token authentication failed', { error });
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Authentication error' 
      });
    }
  }
};