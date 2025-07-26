export interface TestHistoryDashboardData{
    testAttempted: number;
    questionsSolved:number;
    coursesEnrolled:number;
    correctQuestions:number;
    wrongQuestions:number;
    unansweredQuestions:number;
    monthWiseTestAttempted: MonthWiseTests[];
}

export interface MonthWiseTests{
    month:string;
    tests:number;
}

import { Request } from 'express';
import { File as MulterFile } from 'multer';

export interface MulterRequest extends Request {
    file: MulterFile;
}