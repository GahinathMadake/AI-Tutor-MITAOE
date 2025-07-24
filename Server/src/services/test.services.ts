import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';

export class TestService {

  async getTestBasicDetails(userId: string, testId:string) {
    try {
      let query1 = `SELECT 
                    t.test_id AS id,
                    t.test_name AS name,
                    t.total_marks AS totalMarks,
                    t.duration_minutes AS duration,
                    t.start_time AS startTime,
                    t.end_time AS endTime,

                    c.course_name AS courseName,
                    tp.topic_name AS topicName,
                    u.name AS teacherName,

                    COUNT(q.question_id) AS testQuestions

                    FROM test t
                    LEFT JOIN course c ON t.course_id = c.course_id
                    LEFT JOIN topic tp ON t.topic_id = tp.topic_id
                    LEFT JOIN users u ON t.teacher_id = u.user_id
                    LEFT JOIN testquestion q ON q.test_id = t.test_id

                    WHERE t.test_id = '${testId}'

                    GROUP BY 
                    t.test_id, t.test_name, t.total_marks, t.duration_minutes, t.start_time, t.end_time,
                    c.course_name, tp.topic_name, u.name`;
      const testData = await dbService.executeQuery(query1);

    //   let query2 = `SELECT
    //                     test_status_id AS id,
    //                     test_id AS testId,
    //                     student_id AS studentId,
    //                     test_status AS status,
    //                     cheating_reason AS cheatingReason
    //                 FROM teststatus
    //                 WHERE test_id = '${testId}'`;

    let query2 = `SELECT
                    test_status_id AS id,
                    student_id AS studentId,
                    test_status AS status,
                    cheating_reason AS cheatingReason
                FROM teststatus
                WHERE test_status_id = '${testId}'`;

      const testStatusData = await dbService.executeQuery(query2);

      return {
        testData,
        testStatusData
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test Basic-Details', { error: error.message, testId, userId });
      throw new AppError(error.message || 'Failed to Fetch Test Basic-Details', 500);
    }
  }

  async getTestAnalytics(userId: string, testId:string) {
    try {
      let query1 = `SELECT 
                      ts.test_submission_id AS id,
                      ts.student_answer AS answer,
                      ts.marks_obtained AS marksObtained,
                      ts.hints_used_count AS hintsUsed,

                      q.question_id AS "question.id",
                      q.question_text AS "question.text",
                      q.question_type AS "question.type",
                      q.options AS "question.options",
                      q.correct_answer AS "question.correctAnswer",
                      q.hints AS "question.hints",
                      q.createdAt AS "question.createdAt"

                    FROM testsubmission ts
                    JOIN question q ON ts.question_id = q.question_id

                    WHERE ts.test_id = '${testId}' AND ts.student_id = '${userId}' LIMIT 1`;

      const submissionData = await dbService.executeQuery(query1);

      console.log(submissionData);

      return {
        submissionData,
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test Basic-Details', { error: error.message, testId, userId });
      throw new AppError(error.message || 'Failed to Fetch Test Basic-Details', 500);
    }
  }

}

export const testService = new TestService();