import { config } from './config';
import { AppError } from '../errors/ApiError';
import { logger } from '../utils/logger';
import { DatabaseTest, CreateTestData, UpdateTestData, TestFilters, TestResult } from '../types/test';

export class TestDatabaseService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.WORQHAT_API_KEY;
    this.baseUrl = 'https://api.worqhat.com/api/db';
  }

  private async executeQuery(query: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/run-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new AppError(`Database query failed: ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      logger.error('Database query error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Database connection failed', 500);
    }
  }

  private generateUUID(): string {
    return 'test_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private sanitizeString(str: string): string {
    return str.replace(/'/g, "''");
  }

  private formatDateTime(date: string): string {
    return new Date(date).toISOString().replace('T', ' ').substring(0, 19);
  }

  async createTest(testData: CreateTestData): Promise<DatabaseTest> {
    const testId = this.generateUUID();
    const now = new Date().toISOString();
    
    const query = `
      INSERT INTO test (
        test_id, test_name, total_marks, duration_minutes, start_time, end_time, maximum_attempts_allowed, course_id, teacher_id, topic_id) 
        VALUES(
        '${testId}',
        '${this.sanitizeString(testData.name)}',
        ${testData.totalMarks},
        ${testData.duration},
        '${this.formatDateTime(testData.startTime)}',
        '${this.formatDateTime(testData.endTime)}',
        ${testData.maxAttempts},
        '${testData.courseId}',
        '${testData.teacherId}',
        '${testData.topicId}'
      )
    `;

    try {
      await this.executeQuery(query);
      
      return {
        id: testId,
        name: testData.name,
        totalMarks: testData.totalMarks,
        duration: testData.duration,
        startTime: testData.startTime,
        endTime: testData.endTime,
        maxAttempts: testData.maxAttempts,
        courseId: testData.courseId,
        teacherId: testData.teacherId,
        topicId: testData.topicId,
        createdAt: now
      };
    } catch (error) {
      logger.error('Failed to create test:', error);
      throw new AppError('Failed to create test', 500);
    }
  }

  async getTestById(testId: string): Promise<DatabaseTest | null> {
    const query = `SELECT * FROM test WHERE test_id = '${testId}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const test = result.data[0];
        return {
          id: test.test_id,
          name: test.test_name,
          totalMarks: test.total_marks,
          duration: test.duration_minutes,
          startTime: test.start_time,
          endTime: test.end_time,
          maxAttempts: test.maximum_attempts_allowed,
          courseId: test.course_id,
          teacherId: test.teacher_id,
          topicId: test.topic_id,
          createdAt: test.createdAt,
          updatedAt: test.updatedAt
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to fetch test:', error);
      throw new AppError('Failed to fetch test', 500);
    }
  }

  async getTests(filters: TestFilters = {}): Promise<DatabaseTest[]> {
    let query = 'SELECT * FROM test WHERE 1=1';
    
    if (filters.teacherId) {
      query += ` AND teacher_id = '${filters.teacherId}'`;
    }
    
    if (filters.courseId) {
      query += ` AND course_id = '${filters.courseId}'`;
    }
    
    if (filters.topicId) {
      query += ` AND topic_id = '${filters.topicId}'`;
    }
    
    if (filters.status) {
      const now = new Date().toISOString();
      switch (filters.status) {
        case 'upcoming':
          query += ` AND startTime > '${now}'`;
          break;
        case 'ongoing':
          query += ` AND startTime <= '${now}' AND endTime >= '${now}'`;
          break;
        case 'completed':
          query += ` AND endTime < '${now}'`;
          break;
      }
    }
    
    query += ' ORDER BY createdAt DESC';
    
    if (filters.limit) {
      query += ` LIMIT ${filters.limit}`;
    }
    
    if (filters.offset) {
      query += ` OFFSET ${filters.offset}`;
    }

    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        return result.data.map((test: any) => ({
          id: test.test_id,
          name: test.test_name,
          totalMarks: test.total_marks,
          duration: test.duration_minutes,
          startTime: test.start_time,
          endTime: test.end_time,
          maxAttempts: test.maximum_attempts_allowed,
          courseId: test.course_id,
          teacherId: test.teacher_id,
          topicId: test.topic_id,
          createdAt: test.createdAt,
          updatedAt: test.updatedAt
        }));
      }
      
      return [];
    } catch (error) {
      logger.error('Failed to fetch tests:', error);
      throw new AppError('Failed to fetch tests', 500);
    }
  }

async updateTest(testId: string, updates: UpdateTestData): Promise<DatabaseTest | null> {
  const validUpdates = Object.entries(updates)
    .filter(([key, value]) =>
      value !== undefined &&
      key !== 'id' &&
      key !== 'createdAt'
    );

  if (validUpdates.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const now = new Date().toISOString();

  const fieldMapping: Record<string, string> = {
    name: 'test_name',
    totalMarks: 'total_marks',
    duration: 'duration_minutes',
    startTime: 'start_time',
    endTime: 'end_time',
    maxAttempts: 'maximum_attempts_allowed',
  };

  const setClause = validUpdates.map(([key, value]) => {
    const dbField = fieldMapping[key];
    if (!dbField) return '';

    if (key === 'startTime' || key === 'endTime') {
      return `${dbField} = '${this.formatDateTime(String(value))}'`;
    }

    if (typeof value === 'string') {
      return `${dbField} = '${this.sanitizeString(value)}'`;
    }

    return `${dbField} = ${value}`;
  }).filter(Boolean).join(', ');

  const query = `
    UPDATE test 
    SET ${setClause}, updatedAt = '${this.formatDateTime(String(now))}' 
    WHERE test_id = '${testId}'
  `;

  console.log('Executing update query:', query);

  try {
    await this.executeQuery(query);
    return await this.getTestById(testId);
  } catch (error) {
    logger.error('Failed to update test:', error);
    throw new AppError('Failed to update test', 500);
  }
}


  async deleteTest(testId: string): Promise<boolean> {
    const query = `DELETE FROM test WHERE test_id = '${testId}'`;
    
    try {
      await this.executeQuery(query);
      return true;
    } catch (error) {
      logger.error('Failed to delete test:', error);
      throw new AppError('Failed to delete test', 500);
    }
  }

  async getTestResults(testId: string): Promise<TestResult[]> {
    const query = `
      SELECT 
        tr.testId,
        tr.studentId,
        u.name as studentName,
        tr.score,
        tr.totalMarks,
        tr.percentage,
        tr.submittedAt,
        tr.timeTaken,
        tr.attempt
      FROM test_results tr
      JOIN users u ON tr.studentId = u.id
      WHERE tr.testId = '${testId}'
      ORDER BY tr.submittedAt DESC
    `;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        return result.data.map((result: any) => ({
          testId: result.testId,
          studentId: result.studentId,
          studentName: result.studentName,
          score: result.score,
          totalMarks: result.totalMarks,
          percentage: result.percentage,
          submittedAt: result.submittedAt,
          timeTaken: result.timeTaken,
          attempt: result.attempt
        }));
      }
      
      return [];
    } catch (error) {
      logger.error('Failed to fetch test results:', error);
      throw new AppError('Failed to fetch test results', 500);
    }
  }

  async getTestsByTeacher(teacherId: string): Promise<DatabaseTest[]> {
    return this.getTests({ teacherId });
  }

  async getTestsByCourse(courseId: string): Promise<DatabaseTest[]> {
    return this.getTests({ courseId });
  }

  async getTestsByTopic(topicId: string): Promise<DatabaseTest[]> {
    return this.getTests({ topicId });
  }
}

export const testDbService = new TestDatabaseService();