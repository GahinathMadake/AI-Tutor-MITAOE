import { Router } from 'express';
import { studentCoursesController } from '../../controllers/course.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../errors/errorHandler';

const router = Router();

router.use(authenticateToken);

router.get(
  '/get-course-details/:courseId',
  asyncHandler(studentCoursesController.getCourseDetailsForEnrollement)
);

router.get(
  '/enroll-me/:courseId',
  asyncHandler(studentCoursesController.EnrollMeInTheCourse)
);

export default router;