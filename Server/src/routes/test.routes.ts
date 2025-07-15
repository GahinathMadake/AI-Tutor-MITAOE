import { Router } from 'express';
import { testController } from '../controllers/test.controller';
import { validateRequest } from '../middleware/validation.middleware';
import {
  createTestValidators,
  updateTestValidators,
  testIdValidators,
  getTestsValidators,
  teacherIdValidators,
  courseIdValidators,
  topicIdValidators,
} from '../validators/test.validator';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Test Management Routes
// GET /api/tests - List tests (role-based filtering)
router.get(
  '/:userId',
  getTestsValidators,
  validateRequest,
  testController.getTests
);

// POST /api/tests - Create new test (teachers only)
router.post(
  '/:userId',
  createTestValidators,
  validateRequest,
  testController.createTest
);

// GET /api/tests/:id - Get test details
router.get(
  '/:userId/:id',
  testIdValidators,
  validateRequest,
  testController.getTestById
);

// PUT /api/tests/:id - Update test (teachers only)
router.put(
  '/:userId/:id',
  updateTestValidators,
  validateRequest,
  testController.updateTest
);

// DELETE /api/tests/:id - Delete test (teachers only)
router.delete(
  '/:userId/:id',
  testIdValidators,
  validateRequest,
  testController.deleteTest
);

// GET /api/tests/:id/results - Get test results (teachers only)
router.get(
  '/:userId/:id/results',
  testIdValidators,
  validateRequest,
  testController.getTestResults
);

// Additional utility routes
// GET /api/tests/teacher/:teacherId - Get tests by teacher
router.get(
  '/:userId/teacher/:teacherId',
  teacherIdValidators,
  validateRequest,
  testController.getTestsByTeacher
);

// GET /api/tests/course/:courseId - Get tests by course
router.get(
  '/:userId/course/:courseId',
  courseIdValidators,
  validateRequest,
  testController.getTestsByCourse
);

// GET /api/tests/topic/:topicId - Get tests by topic
router.get(
  '/:userId/topic/:topicId',
  topicIdValidators,
  validateRequest,
  testController.getTestsByTopic
);

export default router;