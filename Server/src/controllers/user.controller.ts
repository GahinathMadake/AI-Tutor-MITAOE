import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { logger } from '../utils/logger';

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
    const {
      testCompletedResult,
      questionsSolvedResult,
      enrollmentResult
    } = await userService.getStudentDashboardData(user.id);

    const testCompleted = Number(testCompletedResult.data?.[0]?.testCompleted || 0);
    const questionsSolved = Number(questionsSolvedResult.data?.[0]?.questionsSolved || 0);

    const enrollmentData = enrollmentResult.data || [];

    let ongoingCoursesCount = 0;
    let completedCoursesCount = 0;

    const OngoingCourses: Array<{
      id: any;
      name: any;
      progress: number;
      schoolID: any;
      instructor: any;
      totalTests: any;
      completedTests: any;
    }> = [];


    for (const course of enrollmentData) {
      const completedTests = Number(course.completedTests || 0);
      const totalTests = Number(course.total_tests || 0);

      const progress =
        totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;

      if (completedTests === totalTests && totalTests > 0) {
        completedCoursesCount++;
      } else {
        ongoingCoursesCount++;

        OngoingCourses.push({
          id: course["c.course_id"],
          name: course.course_name,
          progress,
          schoolID: course["c.school_id"],
          instructor: course.instructor_name,
          totalTests,
          completedTests,
        });
      }
    }

    const DashboardData = {
      testCompleted,
      questionsSolved,
      ongoingCourses: ongoingCoursesCount,
      completedCourses: completedCoursesCount,
    };

    const response: ApiResponse = {
      success: true,
      data: {
        DashboardData,
        OngoingCourses,
      }
    };

    res.status(200).json(response);
  }

  async getTimeLineEvents(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;

    const {
      timelineEvents
    } = await userService.getStudentTimelineEvents(user.id);

    const response: ApiResponse = {
      success: true,
      data: { timelineEvents: timelineEvents.data }
    };

    res.status(200).json(response);
  }

}

export const userController = new UserController();
export const studentController = new StudentController();