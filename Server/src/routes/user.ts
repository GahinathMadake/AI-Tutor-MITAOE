import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

const router = Router();

// Get current user profile
router.get(
  '/profile',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get complete user details from database
      const dbUser = await dbService.getUserByEmail(user.email);
      
      if (!dbUser) {
        throw new AppError('User profile not found', 404);
      }

      const apiResponse: ApiResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: dbUser.email,
            name: dbUser.name,
            prn: dbUser.prn,
            role: dbUser.role,
            school: dbUser.school,
            status: user.status,
          }
        }
      };

      res.status(200).json(apiResponse);
    } catch (error: any) {
      logger.error('Failed to get user profile', { error: error.message, userId: req.user?.id });
      throw new AppError(error.message || 'Failed to get user profile', 500);
    }
  })
);

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      const updates = req.body;
      
      // Remove fields that shouldn't be updated
      delete updates.id;
      delete updates.email;
      delete updates.user_id;
      delete updates.created_at;
      
      const updatedUser = await dbService.updateUser(user.id, updates);
      
      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      logger.info('User profile updated', { userId: user.id, updates });

      const apiResponse: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            email: updatedUser.email,
            name: updatedUser.name,
            prn: updatedUser.prn,
            role: updatedUser.role,
            school: updatedUser.school,
            status: user.status,
          }
        }
      };

      res.status(200).json(apiResponse);
    } catch (error: any) {
      logger.error('Failed to update user profile', { error: error.message, userId: req.user?.id });
      throw new AppError(error.message || 'Failed to update user profile', 500);
    }
  })
);

export default router;