import { dbService } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from '../errors/ApiError';
import { MonthWiseTests } from '../types/test';
import { startOfMonth, subMonths, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export class TestService {

  async getTestBasicDetails(userId: string, testId: string) {
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

  async getTestAnalytics(userId: string, testId: string) {
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

  async getTest(userId: string, testId: string) {
    try {
      let query1 = `SELECT 
                      t.test_id AS id,
                      t.test_name AS name,
                      t.duration_minutes AS duration,
                      c.course_name AS courseName,
                      c.course_id AS courseId,
                      tp.topic_name AS topicName
                    FROM test t
                    JOIN topic tp ON t.topic_id = tp.topic_id
                    JOIN course c ON t.course_id = c.course_id
                    WHERE t.test_id = '${testId}'
                      AND t.end_time >= now()`;
      const testData = await dbService.executeQuery(query1);

      let query2 = `SELECT 
                      q.question_id AS id,
                      q.question_text AS text,
                      q.question_type AS type,
                      q.options,
                      q.hints
                    FROM testquestion tq
                    JOIN question q ON q.question_id = tq.question_id
                    WHERE tq.test_id = '${testId}'`;
      const testQuestions = await dbService.executeQuery(query2);

      console.log("TestData: ", testData);
      console.log("testData :", testQuestions);

      return {
        testData,
        testQuestions
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test Details for attempting', { error: error.message, testId, userId });
      throw new AppError(error.message || 'Failed to Fetch Test Details for attempting', 500);
    }
  }

  async startTest(userId: string, testId: string) {
    try {
      let query1 = `UPDATE teststatus 
                    SET test_status = 'IN_PROGRESS'
                    WHERE test_id = '${testId}'
                      AND student_id = '${testId}'`;
      const testStatusData = await dbService.executeQuery(query1);

      return {
        testStatusData
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test Details for attempting', { error: error.message, testId, userId });
      throw new AppError(error.message || 'Failed to Fetch Test Details for attempting', 500);
    }
  }

  async submitTest(userId: string, testId: string, courseId: string, cheatingReason: string, answersOfQuestions: { [key: string]: { answer: string; hints: number[]; } }) {
    try {
      // ------------------------- 1. Check test status ----------------------------------

      // let query1 = `SELECT * FROM teststatus WHERE test_id = '${testId}' AND student_id = '${userId}' LIMIT 1`;
      let query1 = `SELECT * FROM teststatus WHERE test_status_id = '${testId}' AND student_id = '${userId}' LIMIT 1`;
      const testStatus = await dbService.executeQuery(query1);

      if (!testStatus.success) {
        throw new AppError("Submission for invalid test!", 400);
      }

      if (testStatus.data[0].test_status === "COMPLETED") {
        throw new AppError("Test already submitted!", 400);
      }



      // ------------------------- 2. Fetch all questions involved in this test ----------------------------------
      const questionIds = Object.keys(answersOfQuestions);

      let query2 = `SELECT question_id, correct_answer, question_type FROM question WHERE question_id IN (${questionIds.map(q => `'${q}'`).join(",")})`;
      const questions = await dbService.executeQuery(query2);




      // ------------------------- 3. Prepare submissions and store them ----------------------------------
      for (const [questionId, answerObj] of Object.entries(answersOfQuestions)) {
        const question = questions.data[0].find((q: any) => q.question_id === questionId);

        if(!question){
          throw new AppError("Solutions to the invalid Questions!", 400);
        }

        const studentAnswer = answerObj.answer || "";
        const correctAnswer = question.correct_answer;
        const hintsUsed = Array.isArray(answerObj.hints) ? answerObj.hints.length : 0;
        const questionType = question.question_type;

        let marksObtained = 0;

        if (questionType === "MCQ") {
          const isCorrect = studentAnswer === correctAnswer;
          marksObtained = isCorrect ? Math.max(0, 5 - hintsUsed) : 0;
        }
        else if (questionType === "DIRECT_ANWER") {
          const prompt = JSON.stringify({
            question: `correct answer = '${correctAnswer}'. Answer Given by Student = '${studentAnswer}'.`,
            model: "aicon-v4-nano-160824",
            randomness: 0.5,
            stream_data: false,
            training_data: `
            You are an AI assistant that evaluates student answers to direct questions. Your job is to semantically compare the student's 
            answer with the actual correct answer and assign a score from 0 to ${5-hintsUsed} based on how well the meaning matches.

              Instructions:
            - Score 0: Completely incorrect or irrelevant
            - Score near 0 (e.g., 1 to x/3): Poor match, some vague relevance
            - Score mid-range (e.g., x/3 to 2x/3): Good match, mostly correct meaning
            - Score close to x (e.g., 2x/3 to x): Near-perfect or perfect semantic match

            Your task:
            - Use meaning similarity, not just keyword overlap.
            - Be fair and explain your reasoning for the marks assigned.
            - Assume the max mark 'x' is provided.

            Return the response strictly in this format:
            {
              \"marksObtained\": <score out of x>,
              \"description\": \"<justification for marks given>\"
            }

            Only respond with the JSON in the exact format. No extra text.`,
            response_type: "json",
          });

          try {
            const aiRes = await fetch("https://api.worqhat.com/api/ai/content/v4", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.WORQHAT_API_KEY}`,
              },
              body: prompt,
            });

            const aiJson = await aiRes.json();
            marksObtained = aiJson?.marksObtained ?? 0;
          } catch (err) {
            logger.warn("AI Evaluation failed for Test in Direct Answer Question", err);
            marksObtained = 0;
          }
        }
        else if(questionType === "CODING"){
          // TODO: Add logic for CODING questions here
        }

        //------------ Save test submission --------------
        let submit = `INSERT INTO testsubmission (
                        test_submission_id, student_id, test_id, 
                        question_id, student_answer, marks_obtained, 
                        hints_used_count) 
                      VALUES ('test_submission_${uuidv4()}', '${userId}', '${testId}', '${questionId}', '${studentAnswer}', ${marksObtained}, ${hintsUsed})`;
        
        await dbService.executeQuery(submit);
      }

      // 4. Update teststatus
      let updateQuery =`UPDATE teststatus
                          test_status = 'COMPLETED', 
                          cheating_reason = '${cheatingReason || ""}'
                        WHERE test_id = '${testId}' AND student_id = '${userId}'`;
      await dbService.executeQuery(updateQuery);

      // 5. Update enrollment → completed_test_ids (push equivalent)
      let pushEnrollment = `SELECT completed_test_ids, documentId 
                  FROM enrollment
                  WHERE student_id = '${userId}' AND course_id = '${courseId}'`;
      const existingEnrollment = await dbService.executeQuery(pushEnrollment);

      const enrollment = existingEnrollment.data[0];

      if(!enrollment){
        throw new AppError("You are not enrolled in the Course for attempting Test", 404);
      }


      const updatedCompletedTests = Array.from(new Set([
        ...(enrollment.completed_test_ids || []),
        testId,
      ]));

      await dbService.executeQuery(`
        UPDATE enrollment
        SET completed_test_ids = ${JSON.stringify(updatedCompletedTests)}
        WHERE documentId = '${enrollment.documentId}'
      `);

      return {
        success: true,
      };
    } catch (error: any) {
      logger.error('Failed to Submit Test of student', { error: error.message, testId, userId });
      throw new AppError(error.message || 'Failed to Submit Test of student', 500);
    }
  }

  async getTestHistoryDashboardData(userId: string) {
    try {
      let query1 = `SELECT
                      ts.testAttempted AS testAttempted,
                      e.coursesEnrolled AS coursesEnrolled,
                      s.questionsSolved AS questionsSolved,
                      s.correctQuestions AS correctQuestions,
                      s.wrongQuestions AS wrongQuestions,
                      s.unansweredQuestions AS unansweredQuestions
                    FROM
                      (SELECT count() AS testAttempted FROM teststatus WHERE student_id = '${userId}' AND test_status = 'COMPLETED') AS ts,
                      (SELECT count() AS coursesEnrolled FROM enrollment WHERE student_id = '${userId}' AND enrollment_status = 'ENROLLED') AS e,
                      (SELECT
                          count() AS questionsSolved,
                          countIf(notEmpty(student_answer) AND marks_obtained > 0) AS correctQuestions,
                          countIf(notEmpty(student_answer) AND marks_obtained = 0) AS wrongQuestions,
                          countIf(empty(student_answer)) AS unansweredQuestions
                        FROM testsubmission
                        WHERE student_id = '${userId}'
                      ) AS s`;

      const testHistory = await dbService.executeQuery(query1);



      const results: MonthWiseTests[] = [];

      // Loop over last 12 months (oldest to current)
      for (let i = 11; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i));
        const nextMonthStart = startOfMonth(subMonths(new Date(), i - 1));

        const formattedMonth = format(monthStart, 'LLL');

        const query = `
          SELECT count(*) as tests
          FROM teststatus
          WHERE student_id = '${userId}'
            AND test_status = 'COMPLETED'
            AND updatedAt >= toDateTime('${monthStart.toISOString().slice(0, 19)}')
            AND updatedAt < toDateTime('${nextMonthStart.toISOString().slice(0, 19)}')
        `;

        const row = await dbService.executeQuery(query);
        const tests = Number(row.data.tests ?? 0);

        results.push({
          month: formattedMonth,
          tests,
        });
      }

      return {
        testHistory,
        results
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test-History of user', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to Fetch Test-History of user', 500);
    }
  }

  async getTestHistoryData(userId: string) {
    try {
      // let query1 = `SELECT
      //                 tsb.test_submission_id AS id,
      //                 t.test_id AS testId,
      //                 t.test_name AS name,
      //                 c.course_name AS courseName,
      //                 tp.topic_name AS topicName,
      //                 tsb.marks_obtained AS marksScored,
      //                 t.total_marks AS totalMarks,
      //                 tst.test_status AS testStatus,
      //                 tst.updatedAt AS updatedAt

      //               FROM testsubmission tsb
      //               JOIN test t ON tsb.test_id = t.test_id
      //               JOIN course c ON t.course_id = c.course_id
      //               JOIN topic tp ON t.topic_id = tp.topic_id
      //               LEFT JOIN teststatus tst ON tst.test_id = t.test_id AND tst.student_id = tsb.student_id

      //               WHERE tsb.student_id = '${userId}'`;

      let query1 = `SELECT
                      tsb.test_submission_id AS id,
                      t.test_id AS testId,
                      t.test_name AS name,
                      c.course_name AS courseName,
                      tp.topic_name AS topicName,
                      tsb.marks_obtained AS marksScored,
                      t.total_marks AS totalMarks,
                      tst.test_status AS testStatus,
                      tst.updatedAt AS updatedAt

                    FROM testsubmission tsb
                    JOIN test t ON tsb.test_id = t.test_id
                    JOIN course c ON t.course_id = c.course_id
                    JOIN topic tp ON t.topic_id = tp.topic_id
                    LEFT JOIN teststatus tst ON tst.test_status_id = t.test_id AND tst.student_id = tsb.student_id

                    WHERE tsb.student_id = '${userId}'`;

      const testHistory = await dbService.executeQuery(query1);

      return {
        testHistory,
      };
    } catch (error: any) {
      logger.error('Failed to Fetch Test-History of user', { error: error.message, userId });
      throw new AppError(error.message || 'Failed to Fetch Test-History of user', 500);
    }
  }

}

export const testService = new TestService();