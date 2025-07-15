import { Request, Response, NextFunction } from 'express';
import { testService } from '../services/test.service';
import { AppError } from '../errors/ApiError';
import { logger } from '../utils/logger';
import { CreateTestData, UpdateTestData, TestFilters } from '../types/test';


export class TestController {
  
  async createTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const testData: CreateTestData = {
        name: req.body.name,
        totalMarks: req.body.totalMarks,
        duration: req.body.duration,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        maxAttempts: req.body.maxAttempts,
        courseId: req.body.courseId,
        teacherId: userId, // Use authenticated user's ID
        topicId: req.body.topicId
      };

      const test = await testService.createTest(testData);
      
      res.status(201).json({
        success: true,
        message: 'Test created successfully',
        data: test
      });
    } catch (error) {
      logger.error('Error in createTest controller:', error);
      next(error);
    }
  }

  async getTests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const filters: TestFilters = {
        teacherId: req.query.teacherId as string,
        courseId: req.query.courseId as string,
        topicId: req.query.topicId as string,
        status: req.query.status as 'upcoming' | 'ongoing' | 'completed',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const tests = await testService.getTests(filters, userId);
      
      res.json({
        success: true,
        message: 'Tests retrieved successfully',
        data: tests
      });
    } catch (error) {
      logger.error('Error in getTests controller:', error);
      next(error);
    }
  }

  async getTestById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const testId = req.params.id;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const test = await testService.getTestById(testId, userId);
      
      res.json({
        success: true,
        message: 'Test retrieved successfully',
        data: test
      });
    } catch (error) {
      logger.error('Error in getTestById controller:', error);
      next(error);
    }
  }

  async updateTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const testId = req.params.id;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const updates: UpdateTestData = {
        name: req.body.name,
        totalMarks: req.body.totalMarks,
        duration: req.body.duration,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        maxAttempts: req.body.maxAttempts
      };

      // Remove undefined fields
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof UpdateTestData] === undefined) {
          delete updates[key as keyof UpdateTestData];
        }
      });

      const updatedTest = await testService.updateTest(testId, updates, userId);
      
      res.json({
        success: true,
        message: 'Test updated successfully',
        data: updatedTest
      });
    } catch (error) {
      logger.error('Error in updateTest controller:', error);
      next(error);
    }
  }

  async deleteTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const testId = req.params.id;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      await testService.deleteTest(testId, userId);
      
      res.json({
        success: true,
        message: 'Test deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteTest controller:', error);
      next(error);
    }
  }

  async getTestResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const testId = req.params.id;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const results = await testService.getTestResults(testId, userId);
      
      res.json({
        success: true,
        message: 'Test results retrieved successfully',
        data: results
      });
    } catch (error) {
      logger.error('Error in getTestResults controller:', error);
      next(error);
    }
  }

  async getTestsByTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const teacherId = req.params.teacherId;
      
      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const tests = await testService.getTestsByTeacher(teacherId, userId);
      
      res.json({
        success: true,
        message: 'Tests retrieved successfully',
        data: tests
      });
    } catch (error) {
      logger.error('Error in getTestsByTeacher controller:', error);
      next(error);
    }
  }

  async getTestsByCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.params.courseId;
      
      const tests = await testService.getTestsByCourse(courseId);
      
      res.json({
        success: true,
        message: 'Tests retrieved successfully',
        data: tests
      });
    } catch (error) {
      logger.error('Error in getTestsByCourse controller:', error);
      next(error);
    }
  }

  async getTestsByTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const topicId = req.params.topicId;
      
      const tests = await testService.getTestsByTopic(topicId);
      
      res.json({
        success: true,
        message: 'Tests retrieved successfully',
        data: tests
      });
    } catch (error) {
      logger.error('Error in getTestsByTopic controller:', error);
      next(error);
    }
  }
}

export const testController = new TestController();