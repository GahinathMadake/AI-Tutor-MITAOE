import { Router } from 'express';
import { studentTestController } from '../../controllers/test.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';
import multer from 'multer';

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


// Proctoring of test
const upload = multer({
  storage: multer.memoryStorage(), // Keeps file in memory
});

router.post(
  '/analyse-image', upload.single('image'),
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