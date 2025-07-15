export interface DatabaseTest {
  id: string;
  name: string;
  totalMarks: number;
  duration: number;
  startTime: string;
  endTime: string;
  maxAttempts: number;
  courseId: string;
  teacherId: string;
  topicId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTestData {
  name: string;
  totalMarks: number;
  duration: number;
  startTime: string;
  endTime: string;
  maxAttempts: number;
  courseId: string;
  teacherId: string;
  topicId: string;
}

export interface UpdateTestData {
  name?: string;
  totalMarks?: number;
  duration?: number;
  startTime?: string;
  endTime?: string;
  maxAttempts?: number;
}

export interface TestFilters {
  teacherId?: string;
  courseId?: string;
  topicId?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  limit?: number;
  offset?: number;
}

export interface TestResult {
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  timeTaken: number;
  attempt: number;
}