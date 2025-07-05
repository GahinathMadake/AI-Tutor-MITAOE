import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const result = await userService.getUserProfile(user.id, user.email);
    
    const response: ApiResponse = {
      success: true,
      data: { user: result }
    };

    res.status(200).json(response);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const updates = req.body;
    const result = await userService.updateUserProfile(user.id, updates);
    
    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: result }
    };

    res.status(200).json(response);
  }
}

export const userController = new UserController();