import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

class StudentSchoolController {

    async getSchoolDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { schoolId } = req.params;

        console.log("Fetching school details for user:", user.id, "School ID:", schoolId);


        const school = {
            id: "sch-1234",
            name: "Greenfield International School",
            createdAt: new Date("2023-01-01"),
            users: [
                {
                    id: "usr-1",
                    name: "Alice Johnson",
                    username: "alicejohn",
                    prn: 1000001,
                    email: "alice@greenfield.edu",
                    password: "hashed-password-alice",
                    role: "TEACHER",
                    schoolId: "sch-1234",
                    createdAt: new Date("2023-01-10"),
                    teachingCourses: [], // will be filled later
                    enrollments: [],
                    createdTests: [],
                    createdQuestions: [],
                    testStatuses: [],
                    testSubmissions: [],
                    notifications: [],
                },
                {
                    id: "usr-2",
                    name: "Bob Smith",
                    username: "bobsmith",
                    prn: 1000002,
                    email: "bob@greenfield.edu",
                    password: "hashed-password-bob",
                    role: "STUDENT",
                    schoolId: "sch-1234",
                    createdAt: new Date("2023-01-12"),
                    teachingCourses: [],
                    enrollments: [],
                    createdTests: [],
                    createdQuestions: [],
                    testStatuses: [],
                    testSubmissions: [],
                    notifications: [],
                },
            ],
            courses: [
                {
                    id: "crs-101",
                    name: "Introduction to AI",
                    description: "A beginner-friendly course on Artificial Intelligence.",
                    enrollmentKey: "AI2024",
                    teacherId: "usr-1",
                    schoolId: "sch-1234",
                    semesterId: "sem-2024-fall",
                    createdAt: new Date("2024-06-10"),
                    teacher: [],
                    school: [],
                    semester: [],
                    chapters: [],
                    enrollments: [],
                    tests: [],
                    questions: [],
                },
            ],
        };

        const response: ApiResponse = {
            success: true,
            data: { school }
        };

        res.status(200).json(response);
    }

}


export const studentSchoolController = new StudentSchoolController();