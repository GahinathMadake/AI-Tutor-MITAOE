import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/profile',
  asyncHandler(userController.getProfile)
);

router.put(
  '/profile',
  asyncHandler(userController.updateProfile)
);

export default router;