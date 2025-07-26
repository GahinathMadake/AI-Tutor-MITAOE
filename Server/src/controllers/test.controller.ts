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

        const { testData, testQuestions } = await testService.getTest(user.id, testId);

        const test = testData.data[0];
        test.testQuestions = testQuestions.data;
        const response: ApiResponse = {
            success: true,
            data: { test }
        };

        return res.status(200).json(response);
    }

    async startTest(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const testId = req.query.testId as string;

        const { testStatusData } = await testService.startTest(user.id, testId);

        if (!testStatusData.success) {
            throw new AppError("Internal Server error!", 500);
        }

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

            const formData = new FormData();
            formData.append('image', req.file.buffer, {
                filename: req.file.originalname || 'capture.jpg',
                contentType: req.file.mimetype || 'image/jpeg'
            });

            const response = await axios.post('https://api.worqhat.com/api/ai/images/v2/face-detection', formData, {
                headers: {
                    Authorization: `Bearer ${process.env.WORQHAT_API_KEY}`,
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            const resData = response.data;

            if (Array.isArray(resData?.data)) {
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