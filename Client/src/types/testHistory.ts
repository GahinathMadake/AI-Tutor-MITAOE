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
    tests:number
}

export interface TestHistory{
    id: string;
    testId:string;
    name: string;
    courseName:string;
    topicName:string;
    marksScored: number;
    totalMarks:number;
    testStatus:string;
    updatedAt:string;
}