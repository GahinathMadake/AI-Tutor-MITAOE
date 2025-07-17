import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';
import { User } from '../types/auth';

export class UserService {
  async getUserProfile(userId: string, email: string) {
    try {
      const dbUser = await dbService.getUserByEmail(email);

      if (!dbUser) {
        throw new AppError('User profile not found', 404);
      }

      return {
        id: userId,
        email: dbUser.email,
        name: dbUser.name,
        prn: dbUser.prn,
        role: dbUser.role,
        school: dbUser.school,
      };
    } catch (error: any) {
      logger.error('Failed to get user profile', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to get user profile', 500);
    }
  }

  async updateUserProfile(userId: string, updates: any) {
    try {
      // Remove fields that shouldn't be updated
      delete updates.id;
      delete updates.email;
      delete updates.user_id;
      delete updates.created_at;

      const updatedUser = await dbService.updateUser(userId, updates);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      logger.info('User profile updated', { userId, updates });

      return {
        id: userId,
        email: updatedUser.email,
        name: updatedUser.name,
        prn: updatedUser.prn,
        role: updatedUser.role,
        school: updatedUser.school,
      };
    } catch (error: any) {
      logger.error('Failed to update user profile', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to update user profile', 500);
    }
  }

  async getStudentDashboardData(userId: string) {
    try {
      let query1 = `SELECT count(*) AS testCompleted 
                      FROM teststatus 
                      WHERE student_id = '${userId}' AND test_status = 'COMPLETED'`;
      let query2 = `SELECT COUNT(*) AS questionsSolved 
                      FROM testsubmission
                      WHERE student_id = '${userId}'`;
      let query3 = `SELECT 
            e.student_id,
            length(e.completed_test_ids) AS completedTests,
            c.course_id,
            c.course_name,
            c.school_id,
            u.name AS instructor_name,
            count(t.test_id) AS total_tests
        FROM enrollment e
        JOIN course c ON e.course_id = c.course_id
        JOIN users u ON c.teacher_id = u.user_id
        LEFT JOIN test t ON c.course_id = t.course_id
        WHERE e.student_id = '${userId}'
        GROUP BY 
            e.student_id,
            e.completed_test_ids,
            c.course_id,
            c.course_name,
            c.school_id,
            u.name`;

      const testCompletedResult = await dbService.executeQuery(query1); // [{ testCompleted: 2 }]
      const questionsSolvedResult = await dbService.executeQuery(query2); // [{ questionsSolved: 1 }]
      const enrollmentResult = await dbService.executeQuery(query3); // Array of courses

      return {
        testCompletedResult,
        questionsSolvedResult,
        enrollmentResult
      };
    } catch (error: any) {
      logger.error('Failed to Fetch student dashboard-data', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to Fetch student dashboard-data', 500);
    }
  }

  async getStudentTimelineEvents(userId: string) {
    try {
      let query = `SELECT 
                    t.test_id AS id,
                    t.test_name AS name,
                    t.start_time,
                    t.end_time,
                    c.course_name AS subject,
                    t.duration_minutes AS duration,
                    t.total_marks AS totalMarks
                  FROM enrollment e
                  JOIN course c ON e.course_id = c.course_id
                  JOIN test t ON c.course_id = t.course_id
                  WHERE e.student_id = '${userId}' 
                    AND e.enrollment_status = 'ENROLLED'
                    AND t.end_time >= NOW()`;

      const timelineEvents = await dbService.executeQuery(query);

      return {
        timelineEvents
      };
    } catch (error: any) {
      logger.error('Failed to Fetch student Test-timeLineEvents', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to Fetch student Test-timeLineEvents', 500);
    }
  }

}

export const userService = new UserService();