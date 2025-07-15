import { body, param, query, ValidationChain } from 'express-validator';

export class CourseValidator {
  static createCourse(): ValidationChain[] {
    return [
      body('name')
        .notEmpty()
        .withMessage('Course name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Course name must be between 2 and 100 characters')
        .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim(),
      
      body('school_id')
        .notEmpty()
        .withMessage('School ID is required')
        .withMessage('School ID must be a valid'),
      
      body('semester_id')
        .notEmpty()
        .withMessage('Semester ID is required')
        .withMessage('Semester ID must be a valid'),
    ];
  }

  static updateCourse(): ValidationChain[] {
    return [
      param('courseId')
        .notEmpty()
        .withMessage('Course ID must be a valid'),
      
      // body('name')
      //   .optional()
      //   .isLength({ min: 2, max: 100 })
      //   .withMessage('Course name must be between 2 and 100 characters')
      //   .trim(),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim(),
      
      body('enrollment_key')
        .optional()
        .isLength({ min: 6, max: 6 })
        .withMessage('Enrollment key must be exactly 6 characters')
        .isAlphanumeric()
        .withMessage('Enrollment key must contain only letters and numbers'),
    ];
  }

  static getCourse(): ValidationChain[] {
    return [
      param('courseId')
        .notEmpty()
        .withMessage('Course ID must be a valid '),
    ];
  }

  static getCourseByEnrollmentKey(): ValidationChain[] {
    return [
      param('enrollmentKey')
        .isLength({ min: 6, max: 6 })
        .withMessage('Enrollment key must be exactly 6 characters')
        .isAlphanumeric()
        .withMessage('Enrollment key must contain only letters and numbers'),
    ];
  }

  static createChapter(): ValidationChain[] {
    return [
      param('courseId')
        .notEmpty()
        .withMessage('Course ID must be a valid UUID'),
      
      body('name')
        .notEmpty()
        .withMessage('Chapter name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Chapter name must be between 2 and 100 characters')
        .trim(),
    ];
  }

  static updateChapter(): ValidationChain[] {
    return [
      param('chapterId')
        .notEmpty()
        .withMessage('Chapter ID must be a valid'),
      
      body('name')
        .notEmpty()
        .withMessage('Chapter name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Chapter name must be between 2 and 100 characters')
        .trim(),
    ];
  }

  static getChapter(): ValidationChain[] {
    return [
      param('chapterId')
        .notEmpty()
        .withMessage('Chapter ID must be a valid'),
    ];
  }

  static getChaptersByCourse(): ValidationChain[] {
    return [
      param('courseId')
        .notEmpty()
        .withMessage('Course ID must be a valid'),
    ];
  }

  static createTopic(): ValidationChain[] {
    return [
      param('chapterId')
        .notEmpty()
        .withMessage('Chapter ID must be a valid'),
      
      body('name')
        .notEmpty()
        .withMessage('Topic name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Topic name must be between 2 and 100 characters')
        .trim(),
    ];
  }

  static updateTopic(): ValidationChain[] {
    return [
      param('topicId')
        .isUUID()
        .withMessage('Topic ID must be a valid UUID'),
      
      body('name')
        .notEmpty()
        .withMessage('Topic name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Topic name must be between 2 and 100 characters')
        .trim(),
    ];
  }

  static getTopic(): ValidationChain[] {
    return [
      param('topicId')
        .notEmpty()
        .withMessage('Topic ID must be a valid'),
    ];
  }

  static getTopicsByChapter(): ValidationChain[] {
    return [
      param('chapterId')
        .notEmpty()
        .withMessage('Chapter ID must be a valid'),
    ];
  }

  static getCourseStructure(): ValidationChain[] {
    return [
      param('courseId')
        .notEmpty()
        .withMessage('Course ID must be a valid'),
    ];
  }

  static getCourses(): ValidationChain[] {
    return [
      query('school_id')
        .optional()
        .isUUID()
        .withMessage('School ID must be a valid UUID'),
      
      query('semester_id')
        .optional()
        .isUUID()
        .withMessage('Semester ID must be a valid UUID'),
      
      query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .trim(),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer'),
    ];
  }
}
export const courseValidator = new CourseValidator();