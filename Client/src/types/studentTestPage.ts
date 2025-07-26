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
  hints: string[];

  options: string[];  //----> Only IF MCQ
  testCases?: TestCase[];   //----> Only IF CODING
}

export interface TestCase {
  input: string; 
  expected_output: string;
  hidden: boolean;
}


export const LanguageEnum = {
  C: "c",
  CPP: "cpp",
  JAVA: "java",
  PYTHON: "python",
  JAVASCRIPT: "javascript"
} as const;
export type LanguageEnum = typeof LanguageEnum[keyof typeof LanguageEnum];

export const EditorTheme = {
  LIGHT: "vs",
  DARK: "vs-dark",
  HIGH_CONTRAST: "hc-black",
} as const;

export type EditorTheme = typeof EditorTheme[keyof typeof EditorTheme];


