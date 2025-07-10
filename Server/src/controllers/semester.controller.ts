import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

class StudentSemesterController {

    async getSemesterDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;


        const semesters = [
            {
                id: "1f4c5b4a-d23b-4b8e-930e-1c2e384fab90",
                name: "Fall 2024",
                createdAt: new Date("2024-06-01T10:00:00Z"),
                courses: [], // You can populate with mock Course[] later
            },
            {
                id: "9a01f3c3-e4af-4d1e-917d-7a2ff9e13f21",
                name: "Spring 2025",
                createdAt: new Date("2025-01-10T09:30:00Z"),
                courses: [],
            },
            {
                id: "b75c1246-a66b-4ad6-86b3-0c2b3fc44dc4",
                name: "Summer 2025",
                createdAt: new Date("2025-05-15T14:00:00Z"),
                courses: [],
            }
        ];

        const response: ApiResponse = {
            success: true,
            data: { semesters }
        };

        res.status(200).json(response);
    }

}


export const studentSemesterController = new StudentSemesterController();