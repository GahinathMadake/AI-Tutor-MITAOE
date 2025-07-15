/* eslint-disable @typescript-eslint/no-explicit-any */
// Types for Test Management
export interface Test {
  test_id: string;
  name: string;
  totalMarks: number;
  duration: number;
  startTime: string;
  endTime: string;
  maxAttempts: number;
  courseId: string;
  teacherId: string;
  topicId: string;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  result_id: string;
  test_id: string;
  student_id: string;
  score: number;
  attempted_at: string;
  completed_at: string;
  attempt_number: number;
  answers: any[];
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface CreateTestData {
  name: string;
  totalMarks: number;
  duration: number;
  startTime: string;
  endTime: string;
  maxAttempts: number;
  courseId: string;
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

export interface TestState {
  tests: Test[];
  currentTest: Test | null;
  testResults: TestResult[];
  currentTestResults: TestResult[];
  filteredTests: Test[];
  isLoading: boolean;
  error: string;
  success: string;
}

export interface TestContextType extends TestState {
  // Test CRUD methods
  createTest: (testData: CreateTestData) => Promise<void>;
  getTests: (filters?: TestFilters) => Promise<void>;
  getTestById: (testId: string) => Promise<void>;
  updateTest: (testId: string, updateData: UpdateTestData) => Promise<void>;
  deleteTest: (testId: string) => Promise<void>;
  
  // Test results methods
  getTestResults: (testId: string) => Promise<void>;
  
  // Filter methods
  getTestsByTeacher: (teacherId: string) => Promise<void>;
  getTestsByCourse: (courseId: string) => Promise<void>;
  getTestsByTopic: (topicId: string) => Promise<void>;
  
  // Utility methods
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  clearMessages: () => void;
  setCurrentTest: (test: Test | null) => void;
  setCurrentTestResults: (results: TestResult[]) => void;
  applyFilters: (filters: TestFilters) => void;
}