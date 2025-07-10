import { Router } from 'express';
import { studentSchoolController } from '../../controllers/school.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/get-school-by-id/:schoolId',
  asyncHandler(studentSchoolController.getSchoolDetails)
);

export default router;