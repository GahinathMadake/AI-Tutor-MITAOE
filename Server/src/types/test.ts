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