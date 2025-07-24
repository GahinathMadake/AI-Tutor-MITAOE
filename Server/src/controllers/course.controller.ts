import { Response } from 'express';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { courseService } from '../services/course.services';
import { AppError } from '../errors/ApiError';
import { CourseCard, SingleCourseType } from '@/types/course';

class StudentCourseController {

    async getCourseDetailsForEnrollement(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { courseId } = req.params;

        const { courseData, enrollmentData } = await courseService.getCourseDetailsForEnrollement(user.id, courseId);
        console.log(courseData, enrollmentData);

        const course = courseData.data[0];
        // course.enrollments = [];

        course.enrollments = enrollmentData.data.map((enr: any) => ({
            id: enr.id,
            studentId: enr.studentId,
            enrollment_status: enr.enrollment_status
        }));

        const response: ApiResponse = {
            success: true,
            data: { course: course }
        };

        res.status(200).json(response);
    }

    async EnrollMeInTheCourse(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { courseId, enrollmentKey } = req.body;

        const result = await courseService.EnrollMeInTheCourse(user.id, courseId, enrollmentKey);

        if (!result.result.success) {
            throw new AppError('Internal Server Error', 500);
        }

        const response: ApiResponse = {
            success: true,
            message: "User Succeefully Enrolled in the Course",
        };

        res.status(200).json(response);
    }

    async getCoursesByProgress(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { Progress } = req.params;

        const { courseData } = await courseService.getCoursesByProgress(user.id, Progress)


        const rawCourses: CourseCard[] = courseData.data;

        let filteredCourses: CourseCard[] = [];

        if (Progress === "COMPLETED") {
            filteredCourses = rawCourses.filter(
                (course) => course.totalTests > 0 && course.completedTests === course.totalTests
            );
        } else if (Progress === "ONGOING") {
            filteredCourses = rawCourses.filter(
                (course) => course.totalTests > 0 && course.completedTests < course.totalTests
            );
        } else {
            filteredCourses = rawCourses;
        }



        const response: ApiResponse = {
            success: true,
            data: { courses: filteredCourses },
        };

        res.status(200).json(response);
    }

    async getWholeCourseByID(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { courseId } = req.query;

        const { courseData, chapters, enrollmentData } = await courseService.getWholeCourseByID(user.id, courseId as string)


        const course:SingleCourseType = courseData.data[0];
        course.chapters = chapters;
        const enrollment = enrollmentData.data[0];


        const response: ApiResponse = {
            success: true,
            data: { course, enrollment },
        };

        res.status(200).json(response);
    }

}


export const studentCoursesController = new StudentCourseController();