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

router.get(
  '/get-test',
  asyncHandler(studentTestController.getTest)
);

router.patch(
  '/start-test',
  asyncHandler(studentTestController.startTest)
);

router.post(
  '/submit-test',
  asyncHandler(studentTestController.submitTest)
);

router.post(
  '/analyse-image',
  asyncHandler(studentTestController.analyseImage)
);

router.get(
  '/history-dashboard',
  asyncHandler(studentTestController.getTestHistoryDashboardData)
);

router.get(
  '/history-data',
  asyncHandler(studentTestController.getTestHistoryData)
);


export default router;