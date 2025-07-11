import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

class StudentTestController {

    async getTestBasicDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;


        const test = {
            id: "test_123",
            name: "Midterm Exam",
            duration: 60,
            totalMarks: 100,
            startTime: "2024-08-15T09:00:00Z",
            endTime: "2024-11-15T10:00:00Z",
            course: {
                name: "Advanced React"
            },
            topic: {
                name: "Hooks and State Management"
            },
            teacher: {
                name: "Dr. Smith"
            },
            testStatuses: [
                {
                    id: "status_1",
                    status: "completed",
                    score: 85,
                    completedAt: "2023-11-15T09:45:00Z"
                }
            ],
            testQuestions: [
                {
                    id: "q1",
                    questionText: "Explain useState hook",
                    marks: 10,
                    type: "long-answer"
                },
                {
                    id: "q2",
                    questionText: "What is React context?",
                    marks: 15,
                    type: "short-answer"
                }
            ]
        };

        const response = {
            success: true,
            data: { test }
        };

        res.status(200).json(response);
    }

    async getTestAnalytics(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

            const submissions = [
                {
                    id: "sub_1",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_789",
                    answer: "React component lifecycle",
                    marksObtained: 5,
                    hintsUsed: 0,
                    submittedAt: "2023-11-15T09:30:00Z",
                    question: {
                        id: "q_789",
                        questionText: "Explain component lifecycle methods in React",
                        correctAnswer: "mounting, updating, unmounting",
                        marks: 5,
                        hints: ["Think about the three main phases"]
                    }
                },
                {
                    id: "sub_2",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_790",
                    answer: null,
                    marksObtained: 0,
                    hintsUsed: 1,
                    submittedAt: "2023-11-15T09:35:00Z",
                    question: {
                        id: "q_790",
                        questionText: "What is JSX?",
                        correctAnswer: "JavaScript XML",
                        marks: 5,
                        hints: ["Acronym expansion"]
                    }
                }
            ]


        const response: ApiResponse = {
            success: true,
            data: { submissions }
        };

        res.status(200).json(response);
    }

    async getTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        const test = {
  id: "test_123",
  name: "Midterm Assessment",
  totalMarks: 100,
  duration: 60, // in minutes
  maxAttempts: 1,
  startTime: "2025-08-15T09:00:00Z",
  endTime: "2025-08-15T10:00:00Z",
  course: {
    id: "course_001",
    name: "Advanced JavaScript",
  },
  topic: {
    id: "topic_005",
    name: "Asynchronous Programming",
  },
  testQuestions: [
    {
      question: {
        id: "q1",
        text: "What is the purpose of async/await in JavaScript?",
        level: "medium",
        type: "multiple-choice",
        options: [
          "To make functions synchronous",
          "To handle promises more cleanly",
          "To loop through arrays",
          "To call external APIs only"
        ],
        hints: ["Think about promise chaining replacement"]
      }
    },
    {
      question: {
        id: "q2",
        text: "Which method is used to catch errors in async functions?",
        level: "easy",
        type: "single-choice",
        options: [
          ".then()",
          ".finally()",
          "try/catch block",
          ".map()"
        ],
        hints: ["You use it with try in synchronous code too"]
      }
    },
    {
      question: {
        id: "q3",
        text: "Match the async term with its description",
        level: "hard",
        type: "match-the-following",
        options: [
          "Promise → Represents a future value",
          "async → Declares a function returns a Promise",
          "await → Waits for a Promise to resolve",
          "callback → Function passed into another function"
        ],
        hints: ["Relate to how JS handles concurrency"]
      }
    }
  ]
};



        const response: ApiResponse = {
            success: true,
            data: { test }
        };

        res.status(200).json(response);
    }

    async startTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

            const submissions = [
                {
                    id: "sub_1",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_789",
                    answer: "React component lifecycle",
                    marksObtained: 5,
                    hintsUsed: 0,
                    submittedAt: "2023-11-15T09:30:00Z",
                    question: {
                        id: "q_789",
                        questionText: "Explain component lifecycle methods in React",
                        correctAnswer: "mounting, updating, unmounting",
                        marks: 5,
                        hints: ["Think about the three main phases"]
                    }
                },
                {
                    id: "sub_2",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_790",
                    answer: null,
                    marksObtained: 0,
                    hintsUsed: 1,
                    submittedAt: "2023-11-15T09:35:00Z",
                    question: {
                        id: "q_790",
                        questionText: "What is JSX?",
                        correctAnswer: "JavaScript XML",
                        marks: 5,
                        hints: ["Acronym expansion"]
                    }
                }
            ]


        const response: ApiResponse = {
            success: true,
            data: { submissions }
        };

        res.status(200).json(response);
    }

    async submitTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

            const submissions = [
                {
                    id: "sub_1",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_789",
                    answer: "React component lifecycle",
                    marksObtained: 5,
                    hintsUsed: 0,
                    submittedAt: "2023-11-15T09:30:00Z",
                    question: {
                        id: "q_789",
                        questionText: "Explain component lifecycle methods in React",
                        correctAnswer: "mounting, updating, unmounting",
                        marks: 5,
                        hints: ["Think about the three main phases"]
                    }
                },
                {
                    id: "sub_2",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_790",
                    answer: null,
                    marksObtained: 0,
                    hintsUsed: 1,
                    submittedAt: "2023-11-15T09:35:00Z",
                    question: {
                        id: "q_790",
                        questionText: "What is JSX?",
                        correctAnswer: "JavaScript XML",
                        marks: 5,
                        hints: ["Acronym expansion"]
                    }
                }
            ]


        const response: ApiResponse = {
            success: true,
            data: { submissions }
        };

        res.status(200).json(response);
    }

    async analyseImage(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

            const submissions = [
                {
                    id: "sub_1",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_789",
                    answer: "React component lifecycle",
                    marksObtained: 5,
                    hintsUsed: 0,
                    submittedAt: "2023-11-15T09:30:00Z",
                    question: {
                        id: "q_789",
                        questionText: "Explain component lifecycle methods in React",
                        correctAnswer: "mounting, updating, unmounting",
                        marks: 5,
                        hints: ["Think about the three main phases"]
                    }
                },
                {
                    id: "sub_2",
                    studentId: "user_123",
                    testId: "test_456",
                    questionId: "q_790",
                    answer: null,
                    marksObtained: 0,
                    hintsUsed: 1,
                    submittedAt: "2023-11-15T09:35:00Z",
                    question: {
                        id: "q_790",
                        questionText: "What is JSX?",
                        correctAnswer: "JavaScript XML",
                        marks: 5,
                        hints: ["Acronym expansion"]
                    }
                }
            ]


        const response: ApiResponse = {
            success: true,
            data: { submissions }
        };

        res.status(200).json(response);
    }

}


export const studentTestController = new StudentTestController();