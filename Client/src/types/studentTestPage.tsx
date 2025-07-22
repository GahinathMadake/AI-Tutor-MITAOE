export interface TestType {
  id: string;
  name: string;
  duration: number;

  course:{
    id:string;
    name:string;
  };

  topicName: string;
  testQuestions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  question: Question;
  marks: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'DIRECT_ANSWER' | 'CODEING';
  options: string[];
  hints: string[];
}