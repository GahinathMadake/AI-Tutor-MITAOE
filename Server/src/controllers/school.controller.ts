import { Response } from 'express';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { schoolService } from '../services/school.services';

class StudentSchoolController {

    async getSchoolDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { schoolId } = req.params;

        const {
            schoolData,
            schoolUsers,
            SchoolCourses
        } = await schoolService.getSchoolDetails(user.id, schoolId);

        const school = {
            id: schoolData.data[0]?.id,
            name: schoolData.data[0]?.name,
            createdAt: schoolData.data[0]?.createdAt,
            users: schoolUsers.data,
            numberOfCourses: SchoolCourses.data[0]?.numberOfCourses || 0,
        };
        
        const response: ApiResponse = {
            success: true,
            data: { school:school }
        };

        res.status(200).json(response);
    }

}


export const studentSchoolController = new StudentSchoolController();