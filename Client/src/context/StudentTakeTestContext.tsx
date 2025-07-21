import React, { createContext, useState } from 'react';
import type { TestAnalyticsData, TestSubmissionType, TestType } from '@/types/studentTakeTest';
import { API_BASE } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface TestContextType {
  getTest: (testId: string) => Promise<TestType | undefined>;
  getTestAnalytics: (testId: string) => Promise<TestAnalyticsData | undefined>;
}


export const TakeTestContext = createContext<TestContextType | undefined>(undefined);


export const TakeTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testCache] = useState<Map<string, TestType>>(new Map());
  const [analyticsCache] = useState<Map<string, TestAnalyticsData>>(new Map());

  const { token } = useAuth();

  const getTest = async (testId: string): Promise<TestType | undefined> => {
    if (!token) {
      console.warn('Token missing');
      return;
    }

    if (testCache.has(testId)) {
      return testCache.get(testId);
    }

    try {
      const response = await fetch(`${API_BASE}/student/test/get-test-basic-details?testId=${testId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.data.test) {
        testCache.set(testId, result.data.test);
        return result.data.test;
      } else {
        console.error('Test fetch error:', result.message || result.error || result);
      }
    } catch (error) {
      console.error('Error while fetching test:', error);
    }

    return undefined;
  };

  const getTestAnalytics = async (testId: string): Promise<TestAnalyticsData | undefined> => {
    if (!token) return;

    if (analyticsCache.has(testId)) {
      return analyticsCache.get(testId);
    }

    try {
      const response = await fetch(`${API_BASE}/student/test/get-test-analysis?testId=${testId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        let correctQue = 0;
        let wrongQue = 0;
        let skippedQue = 0;
        let correctMarks = 0;
        let hintsUsed = 0;

        const submissions: TestSubmissionType[] = result.data.submissions;

        submissions.forEach((submission) => {
          const submitted = submission.answer?.trim();
          hintsUsed += submission.hintsUsed;

          if (!submitted) {
            skippedQue += 1;
          } else if (submission.marksObtained !== 0) {
            correctQue += 1;
            correctMarks += submission.marksObtained;
          } else {
            wrongQue += 1;
          }
        });

        const analytics: TestAnalyticsData = {
          testAnswers: submissions,
          correctQuestions: correctQue,
          wrongQuestions: wrongQue,
          skippedQuestions: skippedQue,
          totalMarks: 5 * (correctQue + wrongQue + skippedQue),
          correctMarksScored: correctMarks,
          hintsMarks: hintsUsed,
        };

        // ✅ Store in cache
        analyticsCache.set(testId, analytics);

        return analytics;
      } else {
        console.error("API error (test-analysis):", result.message || result.error || result);
      }
    } catch (error) {
      console.error("Error fetching test analysis:", error);
    }

    return undefined;
  };


  return (
    <TakeTestContext.Provider value={{ getTest, getTestAnalytics }}>
      {children}
    </TakeTestContext.Provider>
  );
};
