// Enums
export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export type QuestionType = "MCQ" | "DIRECT_ANSWER" | "CODING";

export type EnrollmentStatus = "ENROLLED" | "UNENROLLED";

export type TestStatusType = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type NotificationType = "CREATED_TEST" | "ADMIN_NOTIFICATION" | "CREATED_COURSE" | "COURSE_ENROLLED";

// Forward declarations to resolve circular references
export interface Course {}
export interface User {}
export interface Test {}
export interface Question {}
export interface TestCase {}
export interface Enrollment {}
export interface Chapter {}
export interface Topic {}
export interface TestQuestion {}
export interface TestStatus {}
export interface TestSubmission {}
export interface Notification {}
export interface School {}
export interface Semester {}

// Interfaces

export interface User {
  id: string;
  name: string;
  username: string;
  prn: number;
  email: string;
  password: string;
  role: Role;
  schoolId?: string;
  createdAt: Date;

  // Relations
  teachingCourses: Course[];
  enrollments: Enrollment[];
  createdTests: Test[];
  createdQuestions: Question[];
  testStatuses: TestStatus[];
  testSubmissions: TestSubmission[];
  notifications: Notification[];
}

export interface School {
  id: string;
  name: string;
  createdAt: Date;

  // Relations
  users: User[];
  courses: Course[];
}

export interface Semester {
  id: string;
  name: string;
  createdAt: Date;

  // Relations
  courses: Course[];
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  enrollmentKey: string;
  teacherId: string;
  schoolId: string;
  semesterId: string;
  createdAt: Date;

  // Relations
  teacher: User;
  school: School;
  semester: Semester;
  chapters: Chapter[];
  enrollments: Enrollment[];
  tests: Test[];
  questions: Question[];
}

export interface Chapter {
  id: string;
  name: string;
  courseId: string;
  createdAt: Date;

  // Relations
  course: Course;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
  createdAt: Date;

  // Relations
  chapter: Chapter;
  tests: Test[];
}

export interface Test {
  id: string;
  name: string;
  totalMarks: number;
  duration: number;
  startTime: Date;
  endTime: Date;
  maxAttempts: number;
  courseId: string;
  teacherId: string;
  topicId: string;
  createdAt: Date;

  // Relations
  course: Course;
  teacher: User;
  topic: Topic;
  testQuestions: TestQuestion[];
  testStatuses: TestStatus[];
  testSubmissions: TestSubmission[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: number;
  options: string[];
  correctAnswer: string;
  hints: string[];
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  courseId: string;
  teacherId: string;
  createdAt: Date;

  // Relations
  course: Course;
  teacher: User;
  testCases: TestCase[];
  testQuestions: TestQuestion[];
  testSubmissions: TestSubmission[];
}

export interface TestCase {
  id: string;
  questionId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  createdAt: Date;

  // Relations
  question: Question;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  completedTestIds: string[];
  enrolledAt: Date;

  // Relations
  student: User;
  course: Course;
}

export interface TestQuestion {
  id: string;
  testId: string;
  questionId: string;
  isValid: boolean;

  // Relations
  test: Test;
  question: Question;
}

export interface TestStatus {
  id: string;
  studentId: string;
  testId: string;
  status: TestStatusType;
  cheatingReason?: string;
  lastUpdated: Date;

  // Relations
  student: User;
  test: Test;
}

export interface TestSubmission {
  id: string;
  studentId: string;
  testId: string;
  questionId: string;
  answer: string;
  marksObtained: number;
  hintsUsed: number;
  submittedAt: Date;

  // Relations
  student: User;
  test: Test;
  question: Question;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  seen: boolean;
  createdAt: Date;

  // Relations
  user: User;
}
