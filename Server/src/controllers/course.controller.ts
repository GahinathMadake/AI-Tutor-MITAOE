import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

class StudentCourseController {

    async getCourseDetailsForEnrollement(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { schoolId } = req.params;

        console.log("Fetching school details for user:", user.id, "School ID:", schoolId);


        const course = {
            id: "course-101",
            name: "Full Stack Web Development",
            description: "Master web development using MERN stack.",
            enrollmentKey: "FSWD2025",
            teacher: {
                id: "teacher-1",
                name: "Prof. Rohan Kulkarni",
            },
            school: {
                id: "school-1",
                name: "MIT Academy of Engineering",
            },
            semester: {
                id: "sem-1",
                name: "Semester 5",
            },
            createdAt: new Date("2024-11-01T10:00:00Z"),
            chapters: [
                { id: "ch-1", name: "HTML & CSS" },
                { id: "ch-2", name: "JavaScript" },
                { id: "ch-3", name: "React.js" },
            ],
            tests: [
                { id: "test-1", title: "React Basics" },
                { id: "test-2", title: "Node Fundamentals" },
            ],
            questions: [
                { id: "q1", text: "Explain useEffect in React." },
                { id: "q2", text: "What is Express.js?" },
                { id: "q3", text: "Difference between var, let, and const?" },
            ],
            enrollments: [
                {
                    id: "enr-1",
                    courseId: "course-101",
                    studentId: "student-007", // match with your current logged-in user
                },
                {
                    id: "enr-2",
                    courseId: "course-101",
                    studentId: "student-011",
                },
            ],
        };

        const response: ApiResponse = {
            success: true,
            data: { course }
        };

        res.status(200).json(response);
    }

    async EnrollMeInTheCourse(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { courseId } = req.params;

        console.log("Fetching details for user:", user.id, "Course  ID:", courseId);

        const response: ApiResponse = {
            success: true,
            message: "User Succeefully Enrolled in the Course",
        };

        res.status(200).json(response);
    }

}


export const studentCoursesController = new StudentCourseController();