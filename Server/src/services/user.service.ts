import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';
import { User } from '../types/auth';

export class UserService {
  async getUserProfile(userId: string, email: string) {
    try {
      const dbUser = await dbService.getUserByEmail(email);
      
      if (!dbUser) {
        throw new AppError('User profile not found', 404);
      }

      return {
        id: userId,
        email: dbUser.email,
        name: dbUser.name,
        prn: dbUser.prn,
        role: dbUser.role,
        school: dbUser.school,
      };
    } catch (error: any) {
      logger.error('Failed to get user profile', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to get user profile', 500);
    }
  }

  async updateUserProfile(userId: string, updates: any) {
    try {
      // Remove fields that shouldn't be updated
      delete updates.id;
      delete updates.email;
      delete updates.user_id;
      delete updates.created_at;
      
      const updatedUser = await dbService.updateUser(userId, updates);
      
      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      logger.info('User profile updated', { userId, updates });

      return {
        id: userId,
        email: updatedUser.email,
        name: updatedUser.name,
        prn: updatedUser.prn,
        role: updatedUser.role,
        school: updatedUser.school,
      };
    } catch (error: any) {
      logger.error('Failed to update user profile', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to update user profile', 500);
    }
  }
}

export const userService = new UserService();