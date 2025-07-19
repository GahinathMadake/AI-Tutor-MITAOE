import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { semesterService } from '../services/semester.services';
import { Semester } from '../types/semester';

class StudentSemesterController {

    async getSemesterDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;

        const {
            semesterData,
            courseData
        } = await semesterService.getSemesterDetails(user.id);

        const semestersMap = new Map<string, Semester>();

        for (const sem of semesterData.data) {
            semestersMap.set(sem.semester_id, {
                id: sem.semester_id,
                name: sem.semester_name,
                courses: []
            });
        }

        for (const course of courseData.data) {
            const semester = semestersMap.get(course.semester_id);
            if (semester) {
                semester.courses.push({
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    school: { name: course.school_name },
                    numberOfEnrollments: course.number_of_enrollments,
                    teacher: { name: course.teacher_name }
                });
            }
        }

        const semesters = Array.from(semestersMap.values());

        const response: ApiResponse = {
            success: true,
            data: { semesters }
        };

        res.status(200).json(response);
    }

}


export const studentSemesterController = new StudentSemesterController();