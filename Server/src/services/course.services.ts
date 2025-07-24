import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';
import { v4 as uuidv4 } from 'uuid';
import { ChapterType } from '@/types/course';



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

  async getCoursesByProgress(userId: string, progress: string) {
    try {

      let query = `SELECT
                      c.course_id AS id,
                      c.course_name AS name,
                      c.description,
                      s.school_name AS schoolName,
                      u.name AS teacherName,
                      length(e.completed_test_ids) AS completedTests,
                      
                      COALESCE(enrollment_counts.num_enrolled, 0) AS numberOfEnrollments,
                      COALESCE(test_counts.total_tests, 0) AS totalTests
                      
                  FROM course c
                  JOIN enrollment e ON e.course_id = c.course_id
                  JOIN users u ON c.teacher_id = u.user_id
                  JOIN school s ON c.school_id = s.school_id

                  LEFT JOIN (
                      SELECT 
                          course_id, 
                          count(*) AS num_enrolled
                      FROM enrollment
                      WHERE enrollment_status = 'ENROLLED'
                      GROUP BY course_id
                  ) AS enrollment_counts ON enrollment_counts.course_id = c.course_id

                  LEFT JOIN (
                      SELECT 
                          course_id, 
                          count(*) AS total_tests
                      FROM test
                      GROUP BY course_id
                  ) AS test_counts ON test_counts.course_id = c.course_id


                  WHERE
                      e.student_id = '${userId}'
                      AND e.enrollment_status = 'ENROLLED'`;

      const courseData = await dbService.executeQuery(query);

      return {
        courseData,
      };
    } catch (error: any) {
      logger.error('Failed to fetch courses by progress', {
        error: error.message,
        userId,
        progress,
      });

      throw new AppError(error.message || 'Failed to fetch courses by progress', 500);
    }
  }

  async getWholeCourseByID(userId: string, courseId: string) {
    try {

      let query1 = `SELECT
                        c.course_id AS id,
                        c.course_name AS name,
                        c.description AS description,
                        c.createdAt AS createdAt,
                        u.name AS teacherName,
                        s.school_name AS schoolName,
                        COALESCE(t.total_tests, 0) AS TotalTests
                    FROM course c
                    JOIN users u ON c.teacher_id = u.user_id
                    JOIN school s ON c.school_id = s.school_id
                    LEFT JOIN (
                        SELECT course_id, count(*) AS total_tests
                        FROM test
                        GROUP BY course_id
                    ) t ON t.course_id = c.course_id
                    WHERE c.course_id = '${courseId}'
                    LIMIT 1`;
      const courseData = await dbService.executeQuery(query1);


      let query2 = `SELECT
                    ch.chapter_id AS chapterId,
                    ch.chapter_name AS chapterName,

                    tp.topic_id AS topicId,
                    tp.topic_name AS topicName,

                    t.test_id AS testId,
                    t.test_name AS testName,
                    t.start_time AS startTime,
                    t.end_time AS endTime

                  FROM chapter ch
                  LEFT JOIN topic tp ON tp.chapter_id = ch.chapter_id
                  LEFT JOIN test t ON t.topic_id = tp.topic_id

                  WHERE ch.course_id = '${courseId}'
                  ORDER BY ch.chapter_id, tp.topic_id, t.test_id`;
      const chapterData = await dbService.executeQuery(query2);


      const chapterMap = new Map<string, ChapterType>();

      for (const row of chapterData.data) {
        const {
          chapterId,
          chapterName,
          topicId,
          topicName,
          testId,
          testName,
          startTime,
          endTime,
        } = row;

        if (!chapterId || !chapterName) continue; // Skip invalid rows

        // 1. Add Chapter if not exists
        if (!chapterMap.has(chapterId)) {
          chapterMap.set(chapterId, {
            id: chapterId,
            name: chapterName,
            topics: [],
          });
        }

        const chapter = chapterMap.get(chapterId)!;

        // 2. If topicId is null, skip topic + test logic
        if (!topicId) continue;

        let topic = chapter.topics.find((t) => t.id === topicId);
        if (!topic) {
          topic = {
            id: topicId,
            name: topicName ?? "Untitled Topic",
            tests: [],
          };
          chapter.topics.push(topic);
        }

        // 3. Only push test if testId is present
        if (testId) {
          topic.tests.push({
            id: testId,
            name: testName ?? "Untitled Test",
            startTime,
            endTime,
          });
        }
      }

      const chapters: ChapterType[] = Array.from(chapterMap.values());

      let query3 = `SELECT 
                      enrollment_id AS id,
                      course_id AS courseId,
                      completed_test_ids AS completedTestIds
                    FROM enrollment
                    WHERE student_id='${userId}' and course_id = '${courseId}'`;
      const enrollmentData = await dbService.executeQuery(query3);

      return {
        courseData,
        chapters,
        enrollmentData,
      };
    } catch (error: any) {
      logger.error('Failed to fetch Single courses', {
        error: error.message,
        userId,
        courseId,
      });

      throw new AppError(error.message || 'Failed to fetch Single courses', 500);
    }
  }

}

export const courseService = new CourseService();