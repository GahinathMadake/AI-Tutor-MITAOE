import { body, param, query } from 'express-validator';

export const createTestValidators = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Test name must be between 1 and 255 characters'),
  
  body('totalMarks')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Total marks must be between 1 and 10000'),
  
  body('duration')
    .isInt({ min: 1, max: 1440 })
    .withMessage('Duration must be between 1 and 1440 minutes (24 hours)'),
  
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  
  body('maxAttempts')
    .isInt({ min: 1, max: 10 })
    .withMessage('Max attempts must be between 1 and 10'),
  
  body('courseId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Course ID is required'),
  
  body('teacherId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Teacher ID is required'),
  
  body('topicId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Topic ID is required'),
];

export const updateTestValidators = [
  param('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Test ID is required'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Test name must be between 1 and 255 characters'),
  
  body('totalMarks')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Total marks must be between 1 and 10000'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage('Duration must be between 1 and 1440 minutes (24 hours)'),
  
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  
  body('maxAttempts')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Max attempts must be between 1 and 10'),
];

export const testIdValidators = [
  param('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Test ID is required'),
];

export const getTestsValidators = [
  query('teacherId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Teacher ID must be valid'),
  
  query('courseId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Course ID must be valid'),
  
  query('topicId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Topic ID must be valid'),
  
  query('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed'])
    .withMessage('Status must be one of: upcoming, ongoing, completed'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
];

export const teacherIdValidators = [
  param('teacherId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Teacher ID is required'),
];

export const courseIdValidators = [
  param('courseId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Course ID is required'),
];

export const topicIdValidators = [
  param('topicId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Topic ID is required'),
];

// Custom validator to check if user has permission to access resource
export const checkTeacherPermission = (req: any, res: any, next: any) => {
  const userRole = req.user?.role;
  const userId = req.user?.id;
  
  if (!userRole || !userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (userRole !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Teacher role required'
    });
  }
  
  next();
};

// Custom validator to check if authenticated user exists
export const checkAuthentication = (req: any, res: any, next: any) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  
  if (!userId || !userRole) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  next();
};