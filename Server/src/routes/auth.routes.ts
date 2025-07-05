import { Router } from 'express';
import { authController } from '../controllers/auth.controllers';
import { asyncHandler } from '../errors/errorHandler';
import { 
  validateEmail, 
  validateToken, 
  validateCompleteSignup, 
  handleValidationErrors 
} from '../validators/auth.validator';

const router = Router();

router.post(
  '/send-magic-link',
  validateEmail,
  handleValidationErrors,
  asyncHandler(authController.sendMagicLink)
);

router.post(
  '/complete-signup',
  validateCompleteSignup,
  handleValidationErrors,
  asyncHandler(authController.completeSignup)
);

router.post(
  '/authenticate',
  validateToken,
  handleValidationErrors,
  asyncHandler(authController.authenticate)
);

router.post(
  '/logout',
  asyncHandler(authController.logout)
);

export default router;