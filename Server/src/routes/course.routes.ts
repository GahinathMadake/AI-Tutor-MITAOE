// File: Server/src/routes/course.routes.ts

import { Router } from 'express';
import { courseController } from '../controllers/course.controller';
import { CourseValidator } from '../validators/course.validator';
import { validateRequest } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../errors/errorHandler';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
// router.use(requireTeacher);

// Course routes
router.post(
  '/:teacherId',
  CourseValidator.createCourse(),
  validateRequest,
  asyncHandler(courseController.createCourse)
);

router.get(
  '/:teacherId',
  CourseValidator.getCourses(),
  validateRequest,
  asyncHandler(courseController.getCourses)
);

router.get(
  '/:teacherId/:courseId',
  CourseValidator.getCourse(),
  validateRequest,
  asyncHandler(courseController.getCourse)
);

router.put(
  '/:teacherId/:courseId',
  CourseValidator.updateCourse(),
  validateRequest,
  asyncHandler(courseController.updateCourse)
);

router.delete(
  '/:teacherId/:courseId',
  CourseValidator.getCourse(),
  validateRequest,
  asyncHandler(courseController.deleteCourse)
);

router.get(
  '/:teacherId/enrollment/:enrollmentKey',
  CourseValidator.getCourseByEnrollmentKey(),
  validateRequest,
  asyncHandler(courseController.getCourseByEnrollmentKey)
);

router.get(
  '/:teacherId/:courseId/structure',
  CourseValidator.getCourseStructure(),
  validateRequest,
  asyncHandler(courseController.getCourseStructure)
);

// Chapter routes
router.post(
  '/:teacherId/:courseId/chapters',
  CourseValidator.createChapter(),
  validateRequest,
  asyncHandler(courseController.createChapter)
);

router.get(
  '/:teacherId/:courseId/chapters',
  CourseValidator.getChaptersByCourse(),
  validateRequest,
  asyncHandler(courseController.getChapters)
);

router.get(
  '/:teacherId/chapters/:chapterId',
  CourseValidator.getChapter(),
  validateRequest,
  asyncHandler(courseController.getChapter)
);

router.put(
  '/:teacherId/chapters/:chapterId',
  CourseValidator.updateChapter(),
  validateRequest,
  asyncHandler(courseController.updateChapter)
);

router.delete(
  '/:teacherId/chapters/:chapterId',
  CourseValidator.getChapter(),
  validateRequest,
  asyncHandler(courseController.deleteChapter)
);

// Topic routes
router.post(
  '/:teacherId/chapters/:chapterId/topics',
  CourseValidator.createTopic(),
  validateRequest,
  asyncHandler(courseController.createTopic)
);

router.get(
  '/:teacherId/chapters/:chapterId/topics',
  CourseValidator.getTopicsByChapter(),
  validateRequest,
  asyncHandler(courseController.getTopics)
);

router.get(
  '/:teacherId/topics/:topicId',
  CourseValidator.getTopic(),
  validateRequest,
  asyncHandler(courseController.getTopic)
);

router.put(
  '/:teacherId/topics/:topicId',
  CourseValidator.updateTopic(),
  validateRequest,
  asyncHandler(courseController.updateTopic)
);

router.delete(
  '/:teacherId/topics/:topicId',
  CourseValidator.getTopic(),
  validateRequest,
  asyncHandler(courseController.deleteTopic)
);

export default router;
