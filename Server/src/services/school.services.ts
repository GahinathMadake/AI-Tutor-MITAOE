import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';

export class SchoolService {

  async getSchoolDetails(userId: string, schoolId:string) {
    try {
      let query1 = `SELECT 
                        s.school_id AS id,
                        s.school_name AS name,
                        s.creation_timestamp AS createdAt
                    FROM school s
                    WHERE s.school_id = '${schoolId}'`;

      let query2 = `SELECT
                    u.user_id AS id,
                    u.name,
                    u.prn_number as prn,
                    u.email,
                    u.role
                    FROM users u
                    WHERE u.school_id = '${schoolId}'`; 

      let query3 = `SELECT
                      COUNT(*) AS numberOfCourses
                      FROM course c
                      WHERE c.school_id = '${schoolId}'`;

      const schoolData = await dbService.executeQuery(query1);
      const schoolUsers = await dbService.executeQuery(query2);
      const SchoolCourses = await dbService.executeQuery(query3);

      return {
        schoolData,
        schoolUsers,
        SchoolCourses
      };
    } catch (error: any) {
      logger.error('Failed to Fetch SchoolData for student SiteHome', { error: error.message, schoolId, userId });
      throw new AppError(error.message || 'Failed to Fetch SchoolData for student SiteHome', 500);
    }
  }

}

export const schoolService = new SchoolService();