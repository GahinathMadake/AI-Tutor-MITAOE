import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../errors/errorHandler';

const router = Router();

router.get(
  '/profile',
  authenticateToken,
  asyncHandler(userController.getProfile)
);

router.put(
  '/profile',
  authenticateToken,
  asyncHandler(userController.updateProfile)
);

export default router;