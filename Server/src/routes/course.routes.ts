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

// Create a new course for a teacher
router.post(
  '/:teacherId',
  CourseValidator.createCourse(),
  validateRequest,
  asyncHandler(courseController.createCourse)
);

// Get all courses for a teacher
router.get(
  '/:teacherId',
  CourseValidator.getCourses(),
  validateRequest,
  asyncHandler(courseController.getCourses)
);

// Get a specific course by ID
router.get(
  '/:teacherId/:courseId',
  CourseValidator.getCourse(),
  validateRequest,
  asyncHandler(courseController.getCourse)
);

// Update a specific course by ID
router.put(
  '/:teacherId/:courseId',
  CourseValidator.updateCourse(),
  validateRequest,
  asyncHandler(courseController.updateCourse)
);

// Delete a specific course by ID
router.delete(
  '/:teacherId/:courseId',
  CourseValidator.getCourse(),
  validateRequest,
  asyncHandler(courseController.deleteCourse)
);

// Get course by enrollment key
router.get(
  '/:teacherId/enrollment/:enrollmentKey',
  CourseValidator.getCourseByEnrollmentKey(),
  validateRequest,
  asyncHandler(courseController.getCourseByEnrollmentKey)
);

// Get course structure (chapters and topics) for a specific course
router.get(
  '/:teacherId/:courseId/structure',
  CourseValidator.getCourseStructure(),
  validateRequest,
  asyncHandler(courseController.getCourseStructure)
);

// Chapter routes

// Create a new chapter for a course
router.post(
  '/:teacherId/:courseId/chapters',
  CourseValidator.createChapter(),
  validateRequest,
  asyncHandler(courseController.createChapter)
);

// Get all chapters for a specific course
router.get(
  '/:teacherId/:courseId/chapters',
  CourseValidator.getChaptersByCourse(),
  validateRequest,
  asyncHandler(courseController.getChapters)
);

// Get a specific chapter by ID
router.get(
  '/:teacherId/chapters/:chapterId',
  CourseValidator.getChapter(),
  validateRequest,
  asyncHandler(courseController.getChapter)
);

// Update a specific chapter by ID
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

// Create a new topic for a specific chapter
router.post(
  '/:teacherId/chapters/:chapterId/topics',
  CourseValidator.createTopic(),
  validateRequest,
  asyncHandler(courseController.createTopic)
);

// Get all topics for a specific chapter
router.get(
  '/:teacherId/chapters/:chapterId/topics',
  CourseValidator.getTopicsByChapter(),
  validateRequest,
  asyncHandler(courseController.getTopics)
);

// Get a specific topic by ID
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
