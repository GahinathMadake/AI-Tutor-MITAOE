import { Router } from 'express';
import { studentSemesterController } from '../../controllers/semester.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/get-all-semester',
  asyncHandler(studentSemesterController.getSemesterDetails)
);

export default router;