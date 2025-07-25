import React, { createContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/utils/api";
import type { TestType } from "@/types/studentTestPage";
import { useNavigate } from "react-router-dom";




type TestPageContextType = {
  Test: TestType;
  fetchTestData: (testId: string) => Promise<{ success: boolean; message: string }>;
  startTestHandller: (testId: string) => Promise<{ success: boolean; message: string }>;
  submitTestHandller: (
    testId: string,
  ) => Promise<{ success: boolean; message: string }>;

  answersOfQuestions: {
    [key: string]: {
      answer: string;
      hints: number[];
    };
  };
  setAnswersOfQuestions: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        answer: string;
        hints: number[];
      };
    }>
  >;

  statusOfQuestion: {
    [key: string]: number;
  };
  setStatusOfQuestion: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;

  cheatingReason: string;
  setCheatingReason: React.Dispatch<React.SetStateAction<string>>;
};


export const TestPageContext = createContext<TestPageContextType | undefined>(undefined);

export const StudentTestPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    if (!token || !user) {
        alert('Unauthorised Access, Please login');
        setTimeout(() => navigate('/auth'), 200);
        return;
    }


    // Data Handlling for the Test
    const [Test, setTest] = useState<TestType>({} as TestType);

    const [answersOfQuestions, setAnswersOfQuestions] = useState<{
        [key: string]: {
            answer: string;
            hints: number[];
        }
    }>({});
    const [statusOfQuestion, setStatusOfQuestion] = useState<{ [key: string]: number }>({});
      {/* 
        Guide for Status of Questions
        1   ===>    Answered
        2   ===> Marked for review
        3   ===> Unanswered
        4   ===> unvisited
       */}

    const [cheatingReason, setCheatingReason] = useState<string>('');
    

    // Fetching Test Data
    const fetchTestData = async (testId: string): Promise<{ success: boolean; message: string }> => {
        if (!testId) {
            return { success: false, message: "Information is not sufficient! Please try again later or contact support." };
        }

        try {
            const storageKey = `test_${testId}_user_${user.id}`;
            const cachedTest = localStorage.getItem(storageKey);

            if (cachedTest && cachedTest !== "undefined") {
                try {
                    const parsed = JSON.parse(cachedTest);
                    setTest(parsed);
                    return { success: true, message: "Loaded test from cache." };
                } catch (err) {
                    console.warn("Invalid cached test data, removing from localStorage...");
                    localStorage.removeItem(storageKey);
                }
            }

            // Fetch from server
            const response = await fetch(`${API_BASE}/student/test/get-test?testId=${testId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (result.success) {
                setTest(result.data.test);
                localStorage.setItem(storageKey, JSON.stringify(result.data.test));
                return { success: true, message: "Test data fetched successfully." };
            } else {
                console.error("API error:", result.message || result.error);
                return { success: false, message: result.message || "Failed to fetch test details." };
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            return { success: false, message: "An unexpected error occurred." };
        }
    };

    // Staring Test
    const startTestHandller = async (
        testId: string
    ): Promise<{ success: boolean; message: string }> => {
        if (!testId) {
            return { success: false, message: "Test ID required." };
        }

        try {
            const response = await fetch(
                `${API_BASE}/student/test/start-test?testId=${testId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                const initialAnswers: {
                    [key: string]: { answer: string; hints: number[] };
                } = {};

                const initialStatus: { [key: string]: number } = {};

                if (Test?.testQuestions) {
                    Test.testQuestions.forEach((testQuestion) => {
                        const qId = testQuestion.question.id;
                        initialAnswers[qId] = { answer: "", hints: [] };
                        initialStatus[qId] = 4;
                    });

                    setAnswersOfQuestions(initialAnswers);
                    setStatusOfQuestion(initialStatus);

                    return { success: true, message: "Test started successfully." };
                }
                else {
                    return { success: false, message: "Test questions not found." };
                }
            } else {
                return {
                    success: false,
                    message: result.message || "Failed to start the test. Please try again later.",
                };
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again later.",
            };
        }
    };

    // Submit Handller
    const submitTestHandller = async (
        testId: string
    ): Promise<{ success: boolean; message: string }> => {

        const courseId = Test?.course?.id as string;

        if (!testId || !courseId) {
            return { success: false, message: "Missing required fields." };
        }

        try {
            const response = await fetch(`${API_BASE}/student/test/submit-test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    answersOfQuestions,
                    testId,
                    courseId,
                    cheatingReason,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const storageKey = `test_${testId}_user_${user.id}`;
                localStorage.removeItem(storageKey);

                return {
                    success: true,
                    message: "Your test was submitted successfully!",
                };
            } else {
                return {
                    success: false,
                    message: result.message || "Failed to submit test.",
                };
            }
        } catch (error) {
            console.error("Submission error:", error);
            return {
                success: false,
                message: "Unexpected error occurred. Please try again.",
            };
        }
    };

    return (
        <TestPageContext.Provider
            value={{
                Test: Test,
                fetchTestData,
                startTestHandller,
                submitTestHandller,
                answersOfQuestions,
                setAnswersOfQuestions,
                statusOfQuestion,
                setStatusOfQuestion,
                cheatingReason,
                setCheatingReason,
            }}
        >
            {children}
        </TestPageContext.Provider>
    );
};
