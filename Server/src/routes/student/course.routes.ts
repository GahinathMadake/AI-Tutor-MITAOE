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

router.post(
  '/enroll-me/',
  asyncHandler(studentCoursesController.EnrollMeInTheCourse)
);

router.get(
  '/get-user-course-by-progress/:Progress',
  asyncHandler(studentCoursesController.getCoursesByProgress)
);

router.get(
  '/get-whole-course',
  asyncHandler(studentCoursesController.getWholeCourseByID)
);

export default router;