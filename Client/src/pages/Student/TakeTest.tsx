import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Check,
  Users,
  FileChartColumnIncreasing,
  CircleHelp,
  Clock4,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Ban
} from 'lucide-react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingSpinnerWithoutHight } from "@/components/layout/LoadingSpinner";
import { useParams } from 'react-router-dom';
import { CorrectAnswers, BeatsStudents, MarksBarChart } from './common/PieChart';
import CommingSoon from "./common/ComingSoon";
import type { TestType, TestSubmissionType, TestAnalyticsData } from "@/types/studentTakeTest";
import { useStudentTestContext } from "@/hooks/useStudentTakeTest";



interface QuestionAnalysisProps {
  question: TestSubmissionType,
  index: number,
}

export const QuestionAnalysis: React.FC<QuestionAnalysisProps> = ({ question, index }) => {
  const { text, correctAnswer, options, hints } = question.question;
  const answered = question.answer?.trim();
  const isAnswered = !!answered;
  const isCorrect =
    isAnswered && answered.toLowerCase() === correctAnswer.trim().toLowerCase();


  return (
    <div className="p-6 border rounded-lg shadow-sm">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold">
          <span>Question {index + 1} </span> - {"  "}
          <Badge> {question.question.type === "MCQ" ? "MCQ" : question.question.type === "DIRECT_ANSWER" ? "Direct Answer" : "CODING"}</Badge>
        </h2>
        <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-sidebar">
          {isCorrect ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Correct
            </>
          ) : answered ? (
            <>
              <XCircle className="h-4 w-4 mr-1" />
              Incorrect
            </>
          ) : (
            <>
              <HelpCircle className="h-4 w-4 mr-1" />
              Unanswered
            </>
          )}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="">{text}</p>
      </div>

      {/* Options */}
      {
        question.question.type === "MCQ" &&
        <ul className="space-y-2 mb-6">
          {
            options.map((text) =>
              <li className="p-3 rounded-md border transition-colors bg-sidebar">
                {text}
              </li>
            )
          }
        </ul>
      }


      {/* Answer Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Correct Answer */}
        <div className="p-3 rounded-md border border-green-100 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
          <div className="flex items-center text-green-800 dark:text-green-400 mb-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <span className="font-medium">Correct Answer</span>
          </div>
          <p className="font-semibold text-green-900 dark:text-green-300">
            {question.question.correctAnswer}
          </p>
        </div>

        {/* Your Answer */}
        <div
          className={`p-3 rounded-md border ${isCorrect
            ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800"
            : answered
              ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800"
              : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
            }`}
        >
          <div
            className={`flex items-center mb-1 ${isCorrect
              ? "text-green-800 dark:text-green-400"
              : answered
                ? "text-red-800 dark:text-red-400"
                : "text-gray-800 dark:text-gray-300"
              }`}
          >
            {answered ? (
              isCorrect ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )
            ) : (
              <HelpCircle className="h-4 w-4 mr-2" />
            )}
            <span className="font-medium">Your Answer</span>
          </div>
          <p
            className={`font-semibold ${isCorrect
              ? "text-green-900 dark:text-green-300"
              : answered
                ? "text-red-900 dark:text-red-300"
                : "text-gray-900 dark:text-gray-200"
              }`}
          >
            {answered ? question.answer : "Not answered"}
          </p>
        </div>
      </div>

      {/* Hints Section */}
      {hints.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center text-amber-600 dark:text-amber-400 mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Available Hints</h3>
          </div>
          <div className="space-y-2 mb-4">
            {hints.map((hintText, index) => (
              <div
                key={index}
                className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-400 text-sm"
              >
                <span className="font-semibold">Hint {index + 1}</span> - {hintText}
              </div>
            ))}
          </div>

          <span className="mt-6 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-md font-medium">
            Hints Used: {question.hintsUsed ?? 0}
          </span>
        </div>
      )}

    </div>
  );
};




export const TestAnalytics = () => {
  const { testId } = useParams();

  const { getTestAnalytics } = useStudentTestContext();

  const [analytics, setAnalytics] = useState<TestAnalyticsData>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!testId) return;

      setLoading(true);
      const data = await getTestAnalytics(testId);
      setAnalytics(data ?? undefined);
      setTimeout(() => setLoading(false), 300);
    };

    fetchAnalytics();
  }, [testId]);



  if (loading) {
    return <div className='w-full h-screen flex justify-center items-center'>
      <LoadingSpinnerWithoutHight />
    </div>
  }

  if (!analytics) {
    return <div className="w-full max-w-xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="border border-red-200 bg-red-50 p-6 rounded-2xl shadow-sm text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <Ban className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-red-700">Test Not Attempted</h2>
        <p className="text-sm text-red-600 mt-2">
          You didn't attempt this test. Your submission was not recorded.
        </p>
      </div>
    </div>
  }

  return (
    <div className='my-3 '>
      <h1 className='text-xl font-semibold my-2'>Test Analysis</h1>
      <div className='flex flex-wrap gap-5'>
        <div className='w-[300px] max-w-sm'>
          <CorrectAnswers correctQuestions={analytics.correctQuestions} wrongQuestions={analytics.wrongQuestions} skippedQuestions={analytics.skippedQuestions} />
        </div>
        <div className='w-[300px] max-w-sm'>
          <BeatsStudents totalMarks={analytics.totalMarks} marksScored={analytics.correctMarksScored} />
        </div>
        <div className='w-[300px] max-w-sm'>
          <MarksBarChart correctMarks={analytics.correctMarksScored} wrongMarks={analytics.wrongQuestions * 5} skippedMarks={analytics.skippedQuestions * 5} hintsMarks={analytics.hintsMarks} />
        </div>
      </div>

      <h1 className='mt-10 mb-5 text-xl font-semibold my-2'>Questions Analysis</h1>

      <div className="space-y-4">
        {analytics.testAnswers.map((question, index) => (
          <QuestionAnalysis key={index} question={question} index={index} />
        ))}
      </div>

    </div>
  )
}




const TakeTest: React.FC = () => {
  const { testId } = useParams();


  const { getTest } = useStudentTestContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [testDetails, setTestDetails] = useState<TestType>();

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) {
        alert('Test ID required');
        return;
      }

      setLoading(true);
      const test = await getTest(testId);
      if (test) setTestDetails(test);
      setTimeout(() => setLoading(false), 500);
    };

    loadTest();
  }, [testId]);



  if (loading) {
    return <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Test`, isCurrentPage: true },
      ]}
    >
      <div className='w-full h-screen flex justify-center items-center'>
        <LoadingSpinnerWithoutHight />
      </div>
    </DashboardLayout>
  }

  if (!testDetails) {
    return <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Test`, isCurrentPage: true },
      ]}
    >
      <div className="max-w-xl mx-auto mt-10 p-4 border border-red-300 rounded-md shadow-sm animate-fade-in">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-1 animate-pulse" />
          <div>
            <div className="text-red-800 font-semibold text-base flex items-center gap-1">
              Test Unavailable <span className="text-red-500">!</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              The test you're trying to access is either unavailable or deleted.
            </p>
            <button
              className="mt-3 px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-100 transition"
              onClick={() =>
                testId
                  ? getTest(testId)
                  : alert("Test ID and token are required")
              }
            >
              <RefreshCw className="inline-block h-4 w-4 mr-1" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  }


  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
        { label: `Test-${testDetails.name}`, isCurrentPage: true },
      ]}
    >
      <div className="flex flex-col items-center w-full px-4 py-6 sm:px-2 md:px-8">
        <Card className="w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden p-0">

          <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-6 sm:p-8 bg-gradient-to-r from-gray-600 to-green-600">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg flex items-center justify-center">
              {
                testDetails.testStatuses.length
                  ? <Check size={50} className="font-semibold" />
                  : <Play size={30} />
              }
            </Avatar>

            <div className="sm:ml-6 mt-4 sm:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{testDetails.courseName}</h2>
              <Badge variant="secondary" className="mt-2 bg-white text-blue-600 text-sm sm:text-base">
                {testDetails.name}
              </Badge>

              <div className="pt-2 text-sm sm:text-base">
                <strong>Topic: </strong>
                <span>{testDetails.topicName}</span>
              </div>

              <div className="pt-2 text-sm sm:text-base">
                <strong>Created by: </strong>
                <span>{testDetails.teacherName}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <FileChartColumnIncreasing className="text-red-500 w-8 h-8" />
                <p className="text-lg sm:text-xl mt-2">{testDetails.totalMarks}</p>
                <p className="text-xs sm:text-sm">Total Marks</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Users className="text-blue-500 w-8 h-8" />
                <p className="text-lg sm:text-xl mt-2">{testDetails.testStatuses.length || 0}</p>
                <p className="text-xs sm:text-sm">Participants</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <CircleHelp className="text-green-500 w-8 h-8" />
                <p className="text-lg sm:text-xl mt-2">{testDetails.testQuestions || 0}</p>
                <p className="text-xs sm:text-sm">Questions</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Clock4 className="text-purple-500 w-8 h-8" />
                <p className="text-lg sm:text-xl mt-2">{testDetails.duration} min</p>
                <p className="text-xs sm:text-sm">Duration</p>
              </div>
            </div>

            <div className="w-full">
              {new Date() < new Date(testDetails.startTime) ? (
                <CommingSoon
                  heading={"Upcoming: Your Next Challenge Awaits!"}
                  duration={testDetails.duration}
                  startTime={testDetails.startTime}
                  endTime={testDetails.endTime}
                />
              ) : new Date() < new Date(testDetails.endTime) ? (
                <CommingSoon
                  testId={testDetails.id}
                  heading={"Ongoing: Go Ahead, Challenge Just Started!"}
                  duration={testDetails.duration}
                  startTime={testDetails.startTime}
                  endTime={testDetails.endTime}
                  testStatuses={testDetails.testStatuses}
                />
              ) : (
                <TestAnalytics />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TakeTest;

