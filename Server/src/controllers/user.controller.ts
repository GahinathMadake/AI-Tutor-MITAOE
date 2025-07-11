import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { dbService } from '../config/database';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const result = await userService.getUserProfile(user.id, user.email);

    const response: ApiResponse = {
      success: true,
      data: { user: result }
    };

    res.status(200).json(response);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const updates = req.body;
    const result = await userService.updateUserProfile(user.id, updates);

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: result }
    };

    res.status(200).json(response);
  }
}

// StudentController
class StudentController {

  async getStudentDashboardData(req: AuthenticatedRequest, res: Response) {

    const user = req.user!;

    let query1 = `SELECT count(*) AS testCompleted FROM teststatus WHERE student_id = ${user.id} AND test_status = 'COMPLETED';`;
    let query2 = `SELECT count(*) AS questionsSolved FROM testS WHERE student_id = ${user.id} AND test_status = 'COMPLETED';`;
    let query3 = `SELECT 
    course_id,
    course_name,
    school_id,
    instructor,
    (SELECT COUNT(*) FROM (SELECT arrayJoin(completed_test_ids) FROM course WHERE course_id = c.course_id)) AS completed_tests,
    (SELECT COUNT(*) FROM test WHERE course_id = c.course_id) AS total_tests
    FROM 
    (
        SELECT 
            c.course_id,
            c.course_name,
            c.school_id,
            u.name AS instructor
        FROM course c
        JOIN "user" u ON c.teacher_id = u.id
        WHERE EXISTS (
            SELECT 1 
            FROM enrollment e
            WHERE e.course_id = c.course_id
            AND e.student_id = '${user.id}'
            AND e.status = 'ENROLLED'
        )
    ) c`;


    async executeSingleQuery(user: { id: string }) {
  try {
    const query = `
      SELECT count(*) AS testCompleted FROM course WHERE student_id = '${user.id}' AND test_status = 'COMPLETED';
      SELECT count(*) AS questionsSolved FROM course WHERE student_id = '${user.id}' AND test_status = 'COMPLETED';

      SELECT 
        course_id,
        course_name, 
        school_id,
        (SELECT name FROM "user" WHERE id = teacher_id) AS instructor,
        (SELECT count(*) FROM arrayJoin(completed_test_ids) WHERE course_id = c.course_id) AS completed_tests,
        (SELECT count(*) FROM test WHERE course_id = c.course_id) AS total_tests
      FROM
      (
        SELECT 
          course_id,
          course_name,
          school_id,
          teacher_id
        FROM course
        WHERE EXISTS (
          SELECT 1 
          FROM enrollment 
          WHERE enrollment.course_id = course.course_id
          AND enrollment.student_id = '${user.id}'
          AND enrollment.status = 'ENROLLED'
        )
      ) c;
    `;
    const result = await this.executeQuery(query);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

    let DashboardData = {
      testCompleted: 2,
      questionsSolved: 1,
      ongoingCourses: 5,
      completedCourses: 1,
    };

    const OngoingCourses = [
  {
    id: "course_101",
    name: "Introduction to AI",
    progress: 60,
    schoolID: "Artificial Intelligence",
    instructor: "Dr. Jane Smith",
    totalTests: 5,
    completedTests: 3,
  },
  {
    id: "course_102",
    name: "Web Development Bootcamp",
    progress: 80,
    schoolID: "Full Stack Development",
    instructor: "Mr. John Doe",
    totalTests: 4,
    completedTests: 4,
  },
  {
    id: "course_103",
    name: "Data Structures & Algorithms",
    progress: 40,
    schoolID: "Computer Science",
    instructor: "Prof. Emily Davis",
    totalTests: 6,
    completedTests: 2,
  },
];

    const response: ApiResponse = {
      success: true,
      data: { DashboardData, OngoingCourses }
    };

    res.status(200).json(response);
  }

  async getTimeLineEvents(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;

    const timelineEvents = [
      {
        id: '1',
        name: 'Mathematics Final Exam',
        startTime: '2025-07-10T10:00:00Z',
        endTime: '2025-07-10T12:00:00Z',
        status: 'upcoming',
        subject: 'Mathematics',
        duration: 120,
        totalMarks: 100
      },
      {
        id: '2',
        name: 'Physics Quiz - Thermodynamics',
        startTime: '2025-07-08T14:00:00Z',
        endTime: '2025-07-08T15:00:00Z',
        status: 'upcoming',
        subject: 'Physics',
        duration: 60,
        totalMarks: 50
      },
      {
        id: '3',
        name: 'Chemistry Lab Test',
        startTime: '2025-07-05T09:00:00Z',
        endTime: '2025-07-05T11:00:00Z',
        status: 'ongoing',
        subject: 'Chemistry',
        duration: 120,
        totalMarks: 75
      },
      {
        id: '4',
        name: 'Computer Science Assignment',
        startTime: '2025-07-03T16:00:00Z',
        endTime: '2025-07-03T18:00:00Z',
        status: 'completed',
        subject: 'Computer Science',
        duration: 120,
        totalMarks: 80
      }
    ];

    const response: ApiResponse = {
      success: true,
      data: { timelineEvents }
    };

    res.status(200).json(response);
  }
}

export const userController = new UserController();
export const studentController = new StudentController();