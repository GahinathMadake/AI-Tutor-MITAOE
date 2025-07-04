import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { stytchClient } from '../config/stytch';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { generateToken } from '../utils/jwt';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import { dbService } from '../config/database';
import { 
  LoginRequest, 
  AuthenticateRequest, 
  CompleteSignupRequest, 
  ApiResponse 
} from '../types/auth';

const router = Router();

// Validation middleware
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const validateToken = body('token')
  .isString()
  .notEmpty()
  .withMessage('Token is required');

const validateCompleteSignup = [
  body('stytch_user_id').isString().notEmpty().withMessage('Stytch user ID is required'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('prn').isString().notEmpty().withMessage('PRN is required'),
  body('role').optional().isInt({ min: 1, max: 3 }).withMessage('Role must be 1, 2, or 3'),
  body('school').optional().isString().withMessage('School must be a string')
];

const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Pass error to next() so Express handles it as an error
    return next(new AppError('Validation failed', 400));
  }
  next();
};

// Send magic link via email
router.post(
  '/send-magic-link',
  validateEmail,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, login_magic_link_url, signup_magic_link_url }: LoginRequest = req.body;

    try {
      const response = await stytchClient.magicLinks.email.loginOrCreate({
        email,
        login_magic_link_url: login_magic_link_url || `${config.CLIENT_URL}/auth/authenticate`,
        signup_magic_link_url: signup_magic_link_url || `${config.CLIENT_URL}/auth/authenticate`,
        login_expiration_minutes: 30,
        signup_expiration_minutes: 30,
      });

      logger.info('Magic link sent successfully', { 
        email, 
        userId: response.user_id,
        userCreated: response.user_created 
      });

      const apiResponse: ApiResponse = {
        success: true,
        message: 'Magic link sent successfully',
        data: {
          user_id: response.user_id,
          user_created: response.user_created,
          email_id: response.email_id
        }
      };

      res.status(200).json(apiResponse);
    } catch (error: any) {
      logger.error('Failed to send magic link', { error: error.message, email });
      throw new AppError(error.message || 'Failed to send magic link', 400);
    }
  })
);

// Complete signup with additional details
router.post(
  '/complete-signup',
  validateCompleteSignup,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { stytch_user_id, name, prn, role, school }: CompleteSignupRequest = req.body;

    try {
      // Get user details from Stytch
      const stytchUser = await stytchClient.users.get({ user_id: stytch_user_id });
      
      if (!stytchUser.emails || stytchUser.emails.length === 0) {
        throw new AppError('User email not found', 400);
      }

      const email = stytchUser.emails[0].email;

      console.log('Completing signup for user:', {
        stytch_user_id,
        name,
        prn,
        email,
        role,
        school
      });



      // Check if user already exists in database
      const existingUser = await dbService.getUserByEmail(email);
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Create user in database
      const dbUser = await dbService.createUser({
        stytch_user_id,
        name,
        prn: Number(prn),
        email,
        role,
        school
      });

      logger.info('User signup completed', { 
        userId: stytch_user_id,
        email,
        name,
        prn 
      });

      const apiResponse: ApiResponse = {
        success: true,
        message: 'Signup completed successfully',
        data: {
          user: {
            id: dbUser.user_id,
            email: dbUser.email,
            name: dbUser.name,
            prn: dbUser.prn,
            role: dbUser.role,
            school: dbUser.school,
            status: 'active'
          }
        }
      };

      res.status(201).json(apiResponse);
    } catch (error: any) {
      logger.error('Failed to complete signup', { error: error.message, stytch_user_id });
      throw new AppError(error.message || 'Failed to complete signup', 400);
    }
  })
);

// Authenticate magic link token
router.post(
  '/authenticate',
  validateToken,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { token }: AuthenticateRequest = req.body;

    try {
      const response = await stytchClient.magicLinks.authenticate({
        token,
        session_duration_minutes: 60 * 24 * 7, // 7 days
      });

      const { user, session } = response;
      const email = user.emails[0]?.email;

      if (!email) {
        throw new AppError('User email not found', 400);
      }

      // Get user details from database
      const dbUser = await dbService.getUserByEmail(email);
      
      if (!dbUser) {
        // User exists in Stytch but not in our database - they need to complete signup
        logger.info('User authenticated but needs to complete signup', { 
          userId: user.user_id,
          email 
        });

        const apiResponse: ApiResponse = {
          success: true,
          message: 'Authentication successful - signup completion required',
          data: {
            user: {
              id: user.user_id,
              email: email,
              name: user.name?.first_name && user.name?.last_name 
                ? `${user.name.first_name} ${user.name.last_name}`
                : null,
              created_at: user.created_at,
              status: user.status,
            },
            requires_completion: true,
            session_id: session?.session_id ?? null,
            expires_at: session?.expires_at ?? null,
          }
        };

        return res.status(200).json(apiResponse);
      }

      // Generate JWT token
      const jwtToken = generateToken(user.user_id, email);

      logger.info('User authenticated successfully', { 
        userId: user.user_id,
        email 
      });

      const apiResponse: ApiResponse = {
        success: true,
        message: 'Authentication successful',
        data: {
          user: {
            id: user.user_id,
            email: dbUser.email,
            name: dbUser.name,
            prn: dbUser.prn,
            role: dbUser.role,
            school: dbUser.school,
            status: user.status,
          },
          token: jwtToken,
          session_id: session?.session_id,
          expires_at: session?.expires_at,
        }
      };

      return res.status(200).json(apiResponse);
    } catch (error: any) {
      logger.error('Authentication failed', { error: error.message });
      throw new AppError(error.message || 'Authentication failed', 401);
    }
  })
);

// Google OAuth - Initialize
router.post('/google/start', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Construct the Google OAuth URL manually
    const params = new URLSearchParams({
      provider: 'google',
      login_redirect_url: `${config.CLIENT_URL}/auth/oauth/callback`,
      signup_redirect_url: `${config.CLIENT_URL}/auth/oauth/callback`,
    });
    const redirect_url = `https://oauth.stytch.com/v1/public/oauth?${params.toString()}`;

    const apiResponse: ApiResponse = {
      success: true,
      data: {
        redirect_url
      }
    };

    res.status(200).json(apiResponse);
  }  catch (error: any) {
    logger.error('Failed to initiate Google OAuth', { error: error.message });
    throw new AppError(error.message || 'Failed to initiate Google OAuth', 400);
  }
}));

// Google OAuth - Handle callback
router.post(
  '/google/authenticate',
  validateToken,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { token }: AuthenticateRequest = req.body;

    try {
      const response = await stytchClient.oauth.authenticate({
        token,
        session_duration_minutes: 60 * 24 * 7, // 7 days
      });

      const { user, session_jwt, session_token } = response;
      const email = user.emails[0]?.email;

      if (!email) {
        throw new AppError('User email not found', 400);
      }

      // Get user details from database
      const dbUser = await dbService.getUserByEmail(email);
      
      if (!dbUser) {
        // User exists in Stytch but not in our database - they need to complete signup
        logger.info('Google OAuth user needs to complete signup', { 
          userId: user.user_id,
          email 
        });

        const apiResponse: ApiResponse = {
          success: true,
          message: 'Google authentication successful - signup completion required',
          data: {
            user: {
              id: user.user_id,
              email: email,
              name: user.name?.first_name && user.name?.last_name 
                ? `${user.name.first_name} ${user.name.last_name}`
                : null,
              created_at: user.created_at,
              status: user.status,
            },
            requires_completion: true,
            session_id: session_jwt ?? session_token ?? null,
            expires_at: null,
          }
        };

        return res.status(200).json(apiResponse);
      }

      // Generate JWT token
      const jwtToken = generateToken(user.user_id, email);

      logger.info('Google OAuth authentication successful', { 
        userId: user.user_id,
        email 
      });

      const apiResponse: ApiResponse = {
        success: true,
        message: 'Google authentication successful',
        data: {
          user: {
            id: user.user_id,
            email: dbUser.email,
            name: dbUser.name,
            prn: dbUser.prn,
            role: dbUser.role,
            school: dbUser.school,
            status: user.status,
          },
          token: jwtToken,
          session_id: session_jwt ?? session_token ?? null,
          expires_at: null,
        }
      };

      return res.status(200).json(apiResponse);
    } catch (error: any) {
      logger.error('Google OAuth authentication failed', { error: error.message });
      throw new AppError(error.message || 'Google OAuth authentication failed', 401);
    }
  })
);

// Logout
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.body.session_id;

  try {
    if (sessionId) {
      await stytchClient.sessions.revoke({ session_id: sessionId });
      logger.info('Session revoked successfully', { sessionId });
    }

    const apiResponse: ApiResponse = {
      success: true,
      message: 'Logout successful'
    };

    res.status(200).json(apiResponse);
  } catch (error: any) {
    logger.error('Logout failed', { error: error.message, sessionId });
    // Even if session revocation fails, we consider logout successful
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}));

export default router;