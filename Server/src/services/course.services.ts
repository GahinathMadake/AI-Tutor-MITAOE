import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';
import { v4 as uuidv4 } from 'uuid';



export class CourseService {

  async getCourseDetailsForEnrollement(userId: string, courseId: string) {
    try {
      let query1 = `SELECT
                c.course_id AS id,
                c.course_name AS name,
                COALESCE(c.description, '') AS description,
                c.createdAt as createdAt,

                sem.semester_name AS semesterName,
                s.school_name AS schoolName,
                u.name AS instructorName,

                COALESCE(ch.chapter_count, 0) AS totalChapters,
                COALESCE(ts.test_count, 0) AS totalTests,
                COALESCE(qs.question_count, 0) AS totalQuestions

                FROM course c
                LEFT JOIN semester sem ON c.semester_id = sem.semester_id
                LEFT JOIN school s ON c.school_id = s.school_id
                LEFT JOIN users u ON c.teacher_id = u.user_id

                LEFT JOIN (
                SELECT course_id, COUNT(*) AS chapter_count
                FROM chapter
                GROUP BY course_id
                ) AS ch ON ch.course_id = c.course_id

                LEFT JOIN (
                SELECT course_id, COUNT(*) AS test_count
                FROM test
                GROUP BY course_id
                ) AS ts ON ts.course_id = c.course_id

                LEFT JOIN (
                SELECT course_id, COUNT(*) AS question_count
                FROM question
                GROUP BY course_id
                ) AS qs ON qs.course_id = c.course_id

                WHERE c.course_id = '${courseId}'
                LIMIT 1`;

      let query2 = `SELECT
                      enrollment_id AS id,
                      student_id AS studentId,
                      enrollment_status
                    FROM enrollment
                    WHERE course_id = '${courseId}'`;

      const courseData = await dbService.executeQuery(query1);
      const enrollmentData = await dbService.executeQuery(query2);

      return {
        courseData,
        enrollmentData
      };
    } catch (error: any) {
      logger.error('Failed to Fetch coures for Enrollment in student', { error: error.message, courseId, userId });
      throw new AppError(error.message || 'Failed to Fetch coures for Enrollment in student', 500);
    }
  }

  async EnrollMeInTheCourse(userId: string, courseId: string, enrollmentKey: string) {
    try {

      // step 1:  check course and fetch enrollmentKey
      let query1 = `SELECT
                      course_id,
                      enrollment_key
                    FROM course
                    WHERE course_id = '${courseId}'
                    LIMIT 1`;

      const courseResult = await dbService.executeQuery(query1);
      const course = courseResult.data[0];

      if (!course) {
        throw new AppError('Course not found', 404);
      }

      if (course.enrollment_key !== enrollmentKey) {
        throw new AppError('Invalid enrollment key', 403);
      }

      // Step 2: Check if already enrolled
      const checkQuery = `
        SELECT enrollment_id
        FROM enrollment
        WHERE student_id = '${userId}' AND course_id = '${courseId}'
        LIMIT 1`;
      const checkResult = await dbService.executeQuery(checkQuery);

      if (checkResult.data.length > 0) {
        throw new AppError('Already enrolled in the course', 400);
      }

      // Enrrollement Create
      const enrollmentId = `enrollment_${uuidv4()}`;
      const insertQuery = `INSERT INTO enrollment (
                            enrollment_id,
                            student_id,
                            course_id,
                            enrollment_status,
                            completed_test_ids
                          ) VALUES (
                            '${enrollmentId}',
                            '${userId}',
                            '${courseId}',
                            'ENROLLED',
                            []
                          )`;
      const result = await dbService.executeQuery(insertQuery);


      return {
        result,
      };
    } catch (error: any) {
      logger.error('Failed to Fetch coures for Enrollment in student', { error: error.message, courseId, userId });
      throw new AppError(error.message || 'Failed to Fetch coures for Enrollment in student', 500);
    }
  }

}

export const courseService = new CourseService();