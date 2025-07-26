export interface TestType {
  id: string;
  name: string;
  duration: number;

  courseName:string;
  courseId:string;
  topicName: string;
  testQuestions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'DIRECT_ANSWER' | 'CODEING';
  options: string[];
  hints: string[];
}