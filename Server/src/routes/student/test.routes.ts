import { Router } from 'express';
import { studentTestController } from '../../controllers/test.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/get-test-basic-details',
  asyncHandler(studentTestController.getTestBasicDetails)
);

router.get(
  '/get-test-analysis',
  asyncHandler(studentTestController.getTestAnalytics)
);

export default router;