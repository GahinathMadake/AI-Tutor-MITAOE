// Server/src/controllers/course.controller.ts
import { Request, Response } from 'express';
import { courseService, CreateCourseRequest, UpdateCourseRequest } from '../services/course.service';
import { AuthenticateRequest  } from '@/types/auth';

export class CourseController {
  
  // Course Methods
  createCourse = async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      const courseData: CreateCourseRequest = {
        name: req.body.name,
        description: req.body.description,
        school_id: req.body.school_id,
        semester_id: req.body.semester_id
      };
      
      const course = await courseService.createCourse(teacherId, courseData);
      
      return res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
      });
    } catch (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating course',
        error: error.message
      });
    }
  };
  
  getCourses = async (req: Request, res: Response) => {
    try {
     const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      const courses = await courseService.getCoursesByTeacher(teacherId);
      
      return res.status(200).json({
        success: true,
        data: courses,
        message: 'Courses retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving courses:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving courses',
        error: error.message
      });
    }
  };
  
  getCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const course = await courseService.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: course,
        message: 'Course retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving course:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving course',
        error: error.message
      });
    }
  };
  
  updateCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const updateData: UpdateCourseRequest = {
        // name: req.body.name,
        description: req.body.description,
        enrollment_key: req.body.enrollment_key
      };
      
      const course = await courseService.updateCourse(courseId, updateData);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: course,
        message: 'Course updated successfully'
      });
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating course',
        error: error.message
      });
    }
  };
  
  deleteCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const success = await courseService.deleteCourse(courseId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or could not be deleted'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting course',
        error: error.message
      });
    }
  };

  getCourseByEnrollmentKey = async (req: Request, res: Response) => {
    try {
      const { enrollmentKey } = req.params;
      
      const course = await courseService.getCourseByEnrollmentKey(enrollmentKey);
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found with this enrollment key'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: course,
        message: 'Course retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving course by enrollment key:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving course',
        error: error.message
      });
    }
  };

  // Chapter Methods
  createChapter = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { name } = req.body;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const chapter = await courseService.createChapter(courseId, name);
      
     return res.status(201).json({
        success: true,
        data: chapter,
        message: 'Chapter created successfully'
      });
    } catch (error) {
      console.error('Error creating chapter:', error);
     return res.status(500).json({
        success: false,
        message: 'Error creating chapter',
        error: error.message
      });
    }
  };

  getChapters = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const chapters = await courseService.getChaptersByCourse(courseId);
      
      return res.status(200).json({
        success: true,
        data: chapters,
        message: 'Chapters retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving chapters:', error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving chapters',
        error: error.message
      });
    }
  };

  getChapter = async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate chapter access
      const hasAccess = await courseService.validateChapterAccess(chapterId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this chapter'
        });
      }

      const chapter = await courseService.getChapterById(chapterId);
      
      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: 'Chapter not found'
        });
      }
      
     return res.status(200).json({
        success: true,
        data: chapter,
        message: 'Chapter retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving chapter:', error);
     return res.status(500).json({
        success: false,
        message: 'Error retrieving chapter',
        error: error.message
      });
    }
  };

  updateChapter = async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { name } = req.body;
     const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate chapter access
      const hasAccess = await courseService.validateChapterAccess(chapterId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this chapter'
        });
      }

      const chapter = await courseService.updateChapter(chapterId, name);
      
      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: 'Chapter not found'
        });
      }
      
     return res.status(200).json({
        success: true,
        data: chapter,
        message: 'Chapter updated successfully'
      });
    } catch (error) {
      console.error('Error updating chapter:', error);
     return res.status(500).json({
        success: false,
        message: 'Error updating chapter',
        error: error.message
      });
    }
  };

  deleteChapter = async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate chapter access
      const hasAccess = await courseService.validateChapterAccess(chapterId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this chapter'
        });
      }

      const success = await courseService.deleteChapter(chapterId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Chapter not found or could not be deleted'
        });
      }
      
     return res.status(200).json({
        success: true,
        message: 'Chapter deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
     return res.status(500).json({
        success: false,
        message: 'Error deleting chapter',
        error: error.message
      });
    }
  };

  // Topic Methods
  createTopic = async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { name } = req.body;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate chapter access
      const hasAccess = await courseService.validateChapterAccess(chapterId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this chapter'
        });
      }

      const topic = await courseService.createTopic(chapterId, name);
      
     return res.status(201).json({
        success: true,
        data: topic,
        message: 'Topic created successfully'
      });
    } catch (error) {
      console.error('Error creating topic:', error);
     return res.status(500).json({
        success: false,
        message: 'Error creating topic',
        error: error.message
      });
    }
  };

  getTopics = async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate chapter access
      const hasAccess = await courseService.validateChapterAccess(chapterId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this chapter'
        });
      }

      const topics = await courseService.getTopicsByChapter(chapterId);
      
     return res.status(200).json({
        success: true,
        data: topics,
        message: 'Topics retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving topics:', error);
     return res.status(500).json({
        success: false,
        message: 'Error retrieving topics',
        error: error.message
      });
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate topic access
      const hasAccess = await courseService.validateTopicAccess(topicId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this topic'
        });
      }

      const topic = await courseService.getTopicById(topicId);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: 'Topic not found'
        });
      }
      
     return res.status(200).json({
        success: true,
        data: topic,
        message: 'Topic retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving topic:', error);
     return res.status(500).json({
        success: false,
        message: 'Error retrieving topic',
        error: error.message
      });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const { name } = req.body;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate topic access
      const hasAccess = await courseService.validateTopicAccess(topicId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this topic'
        });
      }

      const topic = await courseService.updateTopic(topicId, name);
      
      if (!topic) {
        return res.status(404).json({
          success: false,
          message: 'Topic not found'
        });
      }
      
     return res.status(200).json({
        success: true,
        data: topic,
        message: 'Topic updated successfully'
      });
    } catch (error) {
      console.error('Error updating topic:', error);
     return res.status(500).json({
        success: false,
        message: 'Error updating topic',
        error: error.message
      });
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const { topicId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate topic access
      const hasAccess = await courseService.validateTopicAccess(topicId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this topic'
        });
      }

      const success = await courseService.deleteTopic(topicId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Topic not found or could not be deleted'
        });
      }
      
     return res.status(200).json({
        success: true,
        message: 'Topic deleted successfully'
      });
    } catch (error) {
     return console.error('Error deleting topic:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting topic',
        error: error.message
      });
    }
  };

  // Utility Methods
  getCourseStructure = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { teacherId } = req.params;
      
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Teacher ID not found'
        });
      }

      // Validate course access
      const hasAccess = await courseService.validateCourseAccess(courseId, teacherId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied to this course'
        });
      }

      const structure = await courseService.getCourseStructure(courseId);
      
      if (!structure) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      
     return res.status(200).json({
        success: true,
        data: structure,
        message: 'Course structure retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving course structure:', error);
     return res.status(500).json({
        success: false,
        message: 'Error retrieving course structure',
        error: error.message
      });
    }
  };
}

export const courseController = new CourseController();