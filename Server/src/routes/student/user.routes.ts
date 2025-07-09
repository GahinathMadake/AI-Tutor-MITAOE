import { Router } from 'express';
import { studentController } from '../../controllers/user.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/dashboard-data',
  asyncHandler(studentController.getStudentDashboardData)
);

router.get(
  '/time-line-events',
  asyncHandler(studentController.getTimeLineEvents)
);

export default router;