export type QuestionType = "MCQ" | "DIRECT_ANSWER" | "CODING";
export type TestStatusType = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  hints: string[];
  createdAt: Date;
}

export interface TestSubmissionType {
  id: string;
  answer: string;
  marksObtained: number;
  hintsUsed: number;

  question: Question;
}

export interface TestAnalyticsData {
  testAnswers: TestSubmissionType[];
  correctQuestions: number;
  wrongQuestions: number;
  skippedQuestions: number;
  totalMarks: number;
  correctMarksScored: number;
  hintsMarks: number;
}

export interface TestStatus {
  id: string;
  studentId: string;
  status: TestStatusType;
  cheatingReason: string;
}

export interface TestType {
  id: string;
  name: string;
  totalMarks: number;
  duration: number;
  startTime: string;
  endTime: string; 

  courseName: string;
  topicName: string;
  teacherName: string;
  testQuestions:number;

  testStatuses: TestStatus[];
}
