import { Request, Response } from 'express';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';
import { testService } from '../services/test.services';
import { MulterRequest, TestHistoryDashboardData } from '@/types/test';
import { AppError } from '@/errors/ApiError';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';

class StudentTestController {

    async getTestBasicDetails(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        const { testData, testStatusData } = await testService.getTestBasicDetails(user.id, testId);

        const test = testData.data[0];
        test.testStatuses = testStatusData.data;

        const response = {
            success: true,
            data: { test: test }
        };

        return res.status(200).json(response);
    }

    async getTestAnalytics(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        const { submissionData } = await testService.getTestAnalytics(user.id, testId)


        const response: ApiResponse = {
            success: true,
            data: { submission: submissionData.data }
        };

        return res.status(200).json(response);
    }

    async getTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        const test= {
            id: "test_abc123",
            name: "Introduction to Programming",
            duration: 60, // in minutes

            courseName: "Computer Science 101",
            courseId: "course_cs101",
            topicName: "Basics of Programming",

            testQuestions: [
                // ----------- MCQ Questions ------------
                {
                    id: "q_mcq_1",
                    text: "What does HTML stand for?",
                    type: "MCQ",
                    hints: ["It's a markup language", "Used to structure web pages"],
                    options: ["HyperText Markup Language", "HighText Machine Language", "HyperLoop Machine Language", "None of the above"]
                },
                {
                    id: "q_mcq_2",
                    text: "Which keyword is used to declare a constant in JavaScript?",
                    type: "MCQ",
                    hints: ["Think of variables that cannot be changed"],
                    options: ["let", "const", "var", "static"]
                },

                // ---------- DIRECT_ANSWER Questions ------------
                {
                    id: "q_da_1",
                    text: "Define the term 'variable' in programming.",
                    type: "DIRECT_ANSWER",
                    hints: ["Think of storage", "Used to store data"]
                },
                {
                    id: "q_da_2",
                    text: "Explain the difference between a compiler and an interpreter.",
                    type: "DIRECT_ANSWER",
                    hints: ["Both are used for code execution", "Think about execution style"]
                },

                // ------------ CODING Questions ---------------
                {
                    id: "q_code_1",
                    text: "Write a function that returns the sum of two numbers.",
                    type: "CODEING",
                    hints: ["Use function parameters", "Return result"],
                    testCases: [
                        { input: "2 3", expected_output: "5", hidden: false },
                        { input: "-1 1", expected_output: "0", hidden: false },
                        { input: "100 200", expected_output: "300", hidden: true }
                    ]
                },
                {
                    id: "q_code_2",
                    text: "Write a function to check if a given number is a prime number.",
                    type: "CODEING",
                    hints: ["Loop from 2 to sqrt(n)", "Check divisibility"],
                    testCases: [
                        { input: "7", expected_output: "true", hidden: false },
                        { input: "8", expected_output: "false", hidden: false },
                        { input: "13", expected_output: "true", hidden: true }
                    ]
                }
            ]
        };


        // const { testData, testQuestions } = await testService.getTest(user.id, testId);

        // const test = testData.data[0];
        // test.testQuestions = testQuestions.data;
        const response: ApiResponse = {
            success: true,
            data: { test }
        };

        return res.status(200).json(response);
    }

    async startTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        // const { testStatusData } = await testService.startTest(user.id, testId);

        // if (!testStatusData.success) {
        //     throw new AppError("Internal Server error!", 500);
        // }

        const response: ApiResponse = {
            success: true,
            message: "Test Started Succeefully!",
        };

        return res.status(200).json(response);
    }

    async submitTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { answersOfQuestions, testId, courseId, cheatingReason } = req.body;

        await testService.submitTest(user.id, testId, courseId, cheatingReason, answersOfQuestions);

        const response: ApiResponse = {
            success: true,
            message: "Test Submitted Successfully!"
        };

        return res.status(200).json(response);
    }

    async analyseImage(req: MulterRequest, res: Response): Promise<Response> {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image provided' });
            }
            console.log(process.env.WORQHAT_API_KEY_FACE_DETECTION);
            const formData = new FormData();
            formData.append('image', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });

            const response = await axios.post('https://api.worqhat.com/api/ai/images/v2/face-detection', formData, {
                headers: {
                    Authorization: `Bearer ${process.env.WORQHAT_API_KEY_FACE_DETECTION}`,
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            const resData = response.data;

            if (Array.isArray(resData?.data)) {
                console.log("Success");
                return res.status(200).json({
                    success: true,
                    message: 'Face analysis successful',
                    data: {
                        numberOfPeople: resData.data.length,
                    },
                });
            }

            return res.status(400).json({
                success: false,
                message: resData?.message || 'Face analysis failed',
                code: response.status,
            });

        } catch (error) {
            const axiosError = error as AxiosError;

            console.error('Full Error:', error);

            if (axiosError.response) {
                console.error('API Response Error:', {
                    status: axiosError.response.status,
                    data: axiosError.response.data,
                    headers: axiosError.response.headers
                });

                return res.status(axiosError.response.status).json({
                    success: false,
                    message: (axiosError.response.data as any)?.error || 'Processing failed',
                    details: axiosError.response.data,
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Unexpected server error',
                details: axiosError.message,
            });
        }
    };


    async getTestHistoryDashboardData(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;

        const { testHistory, results } = await testService.getTestHistoryDashboardData(user.id);

        const history: TestHistoryDashboardData = testHistory.data[0];
        history.monthWiseTestAttempted = results;

        const response: ApiResponse = {
            success: true,
            data: { dashboard: history }
        };

        return res.status(200).json(response);
    }

    async getTestHistoryData(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;

        const { testHistory } = await testService.getTestHistoryData(user.id);

        console.log(testHistory);

        const response: ApiResponse = {
            success: true,
            data: { testHistory: testHistory.data }
        };

        return res.status(200).json(response);
    }

}


export const studentTestController = new StudentTestController();