import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse, LoginRequest, AuthenticateRequest, CompleteSignupRequest } from '../types/auth';

export class AuthController {
  async sendMagicLink(req: Request, res: Response) {
    const data: LoginRequest = req.body;
    const result = await authService.sendMagicLink(data);
    
    const response: ApiResponse = {
      success: true,
      message: 'Magic link sent successfully',
      data: result
    };

    res.status(200).json(response);
  }

  async completeSignup(req: Request, res: Response) {
    const data: CompleteSignupRequest = req.body;
    const result = await authService.completeSignup(data);
    
    const response: ApiResponse = {
      success: true,
      message: 'Signup completed successfully',
      data: { user: result }
    };

    res.status(201).json(response);
  }

  async authenticate(req: Request, res: Response) {
    const { token }: AuthenticateRequest = req.body;
    const result = await authService.authenticateToken(token);
    
    const response: ApiResponse = {
      success: true,
      message: result.requires_completion 
        ? 'Authentication successful - signup completion required'
        : 'Authentication successful',
      data: result
    };

    res.status(200).json(response);
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.body.session_id;
    await authService.logout(sessionId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Logout successful'
    };

    res.status(200).json(response);
  }
}

export const authController = new AuthController();