import { testDbService } from '../config/testDatabase';
import { AppError } from '../errors/ApiError';
import { logger } from '../utils/logger';
import { DatabaseTest, CreateTestData, UpdateTestData, TestFilters, TestResult } from '../types/test';

export class TestService {
  
  async createTest(testData: CreateTestData): Promise<DatabaseTest> {
    try {
      // Validate test timing
      const startTime = new Date(testData.startTime);
      const endTime = new Date(testData.endTime);
      const now = new Date();

      if (startTime <= now) {
        throw new AppError('Test start time must be in the future', 400);
      }

      if (endTime <= startTime) {
        throw new AppError('Test end time must be after start time', 400);
      }

      if (testData.duration <= 0) {
        throw new AppError('Test duration must be positive', 400);
      }

      if (testData.totalMarks <= 0) {
        throw new AppError('Total marks must be positive', 400);
      }

      if (testData.maxAttempts <= 0) {
        throw new AppError('Max attempts must be positive', 400);
      }

      const test = await testDbService.createTest(testData);
      logger.info(`Test created successfully: ${test.id}`);
      return test;
    } catch (error) {
      logger.error('Error creating test:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create test', 500);
    }
  }

  async getTestById(testId: string, requestingUserId: string): Promise<DatabaseTest> {
    try {
      const test = await testDbService.getTestById(testId);
      
      if (!test) {
        throw new AppError('Test not found', 404);
      }

      // Check permissions - only teachers can view their own tests
      if (test.teacherId !== requestingUserId) {
        throw new AppError('Access denied: You can only view your own tests', 403);
      }

      return test;
    } catch (error) {
      logger.error('Error fetching test:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch test', 500);
    }
  }

  async getTests(filters: TestFilters, requestingUserId: string): Promise<DatabaseTest[]> {
    try {
      // Apply role-based filtering
      const appliedFilters = { ...filters };
      
     
        appliedFilters.teacherId = requestingUserId;

      const tests = await testDbService.getTests(appliedFilters);
      logger.info(`Retrieved ${tests.length} tests`);
      return tests;
    } catch (error) {
      logger.error('Error fetching tests:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch tests', 500);
    }
  }

  async updateTest(testId: string, updates: UpdateTestData, requestingUserId: string): Promise<DatabaseTest> {
    try {
      const existingTest = await testDbService.getTestById(testId);
      
      if (!existingTest) {
        throw new AppError('Test not found', 404);
      }

      // Only teachers can update their own tests
      if (existingTest.teacherId !== requestingUserId) {
        throw new AppError('Access denied: You can only update your own tests', 403);
      }

      // Validate updates if provided
      if (updates.startTime || updates.endTime) {
        const startTime = new Date(updates.startTime || existingTest.startTime);
        const endTime = new Date(updates.endTime || existingTest.endTime);
        
        if (endTime <= startTime) {
          throw new AppError('Test end time must be after start time', 400);
        }
      }

      if (updates.duration !== undefined && updates.duration <= 0) {
        throw new AppError('Test duration must be positive', 400);
      }

      if (updates.totalMarks !== undefined && updates.totalMarks <= 0) {
        throw new AppError('Total marks must be positive', 400);
      }

      if (updates.maxAttempts !== undefined && updates.maxAttempts <= 0) {
        throw new AppError('Max attempts must be positive', 400);
      }

      const updatedTest = await testDbService.updateTest(testId, updates);
      
      if (!updatedTest) {
        throw new AppError('Failed to update test', 500);
      }

      logger.info(`Test updated successfully: ${testId}`);
      return updatedTest;
    } catch (error) {
      logger.error('Error updating test:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update test', 500);
    }
  }

  async deleteTest(testId: string, requestingUserId: string): Promise<void> {
    try {
      const existingTest = await testDbService.getTestById(testId);
      
      if (!existingTest) {
        throw new AppError('Test not found', 404);
      }

      // Only teachers can delete their own tests
      if (existingTest.teacherId !== requestingUserId) {
        throw new AppError('Access denied: You can only delete your own tests', 403);
      }

      // Check if test has started
      const now = new Date();
      const startTime = new Date(existingTest.startTime);
      
      if (startTime <= now) {
        throw new AppError('Cannot delete a test that has already started', 400);
      }

      const success = await testDbService.deleteTest(testId);
      
      if (!success) {
        throw new AppError('Failed to delete test', 500);
      }

      logger.info(`Test deleted successfully: ${testId}`);
    } catch (error) {
      logger.error('Error deleting test:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete test', 500);
    }
  }

  async getTestResults(testId: string, requestingUserId: string): Promise<TestResult[]> {
    try {
      const test = await testDbService.getTestById(testId);
      
      if (!test) {
        throw new AppError('Test not found', 404);
      }

      // Only teachers can view results of their own tests
      if (test.teacherId !== requestingUserId) {
        throw new AppError('Access denied: You can only view results of your own tests', 403);
      }

      const results = await testDbService.getTestResults(testId);
      logger.info(`Retrieved ${results.length} test results for test: ${testId}`);
      return results;
    } catch (error) {
      logger.error('Error fetching test results:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch test results', 500);
    }
  }

  async getTestsByTeacher(teacherId: string, requestingUserId: string): Promise<DatabaseTest[]> {
    try {
      // Teachers can only view their own tests
      if (teacherId !== requestingUserId) {
        throw new AppError('Access denied: You can only view your own tests', 403);
      }

      const tests = await testDbService.getTestsByTeacher(teacherId);
      logger.info(`Retrieved ${tests.length} tests for teacher: ${teacherId}`);
      return tests;
    } catch (error) {
      logger.error('Error fetching tests by teacher:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch tests by teacher', 500);
    }
  }

  async getTestsByCourse(courseId: string): Promise<DatabaseTest[]> {
    try {
      const tests = await testDbService.getTestsByCourse(courseId);
      logger.info(`Retrieved ${tests.length} tests for course: ${courseId}`);
      return tests;
    } catch (error) {
      logger.error('Error fetching tests by course:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch tests by course', 500);
    }
  }

  async getTestsByTopic(topicId: string): Promise<DatabaseTest[]> {
    try {
      const tests = await testDbService.getTestsByTopic(topicId);
      logger.info(`Retrieved ${tests.length} tests for topic: ${topicId}`);
      return tests;
    } catch (error) {
      logger.error('Error fetching tests by topic:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch tests by topic', 500);
    }
  }
}

export const testService = new TestService();