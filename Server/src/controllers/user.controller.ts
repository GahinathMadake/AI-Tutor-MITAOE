import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

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

    let DashboardData = {
      testCompleted: 2,
      questionsSolved: 1,
      ongoingCourses: 5,
      completedCourses: 1,
    };

    const OngoingCourses = [
      
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