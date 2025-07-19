import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';

export class SemesterService {

  async getSemesterDetails(userId: string) {
    try {
      let query1 = `SELECT semester_id, semester_name
      FROM semester
      ORDER BY semester_name`;

      let query2 = `SELECT
                      c.course_id as id,
                      c.course_name as name,
                      coalesce(c.description, '') AS description,
                      c.semester_id,
                      s.school_name,
                      t.name AS teacher_name,
                      coalesce(ec.enrollment_count, 0) AS number_of_enrollments
                    FROM course AS c
                    LEFT JOIN school AS s ON c.school_id = s.school_id
                    LEFT JOIN users AS t ON c.teacher_id = t.user_id
                    LEFT JOIN (
                      SELECT
                        course_id,
                        count(*) AS enrollment_count
                      FROM enrollment
                      WHERE enrollment_status = 'ENROLLED'
                      GROUP BY course_id
                    ) AS ec ON c.course_id = ec.course_id
                    ORDER BY c.semester_id, c.course_id`;

      const semesterData = await dbService.executeQuery(query1);
      const courseData = await await dbService.executeQuery(query2);

      return {
        semesterData,
        courseData
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Semester Data for student SiteHome', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to Fetch Semester Data for student SiteHome', 500);
    }
  }

}

export const semesterService = new SemesterService();