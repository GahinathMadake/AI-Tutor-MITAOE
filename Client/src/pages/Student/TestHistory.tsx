import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart2, BookOpen, CheckCircle, MoreVertical, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from 'react-router-dom';
import type { TestHistoryDashboardData, TestHistory as TestHistoryType  } from '@/types/studentTestHistory';
import { Button } from '@/components/ui/button';
import { CorrectAnswers, TestsAttempted } from './common/PieChart';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE } from '@/utils/api';
import { LoadingSpinnerWithoutHight } from '@/components/layout/LoadingSpinner';


const Pagination = ({ currentPage, totalPages, onPageChange, maxVisible = 3 }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisible?: number;
}) => {
    const getVisiblePages = () => {
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisible - 1);

        // Adjust if we're at the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];


        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        // Visible range
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Always show last page
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </Button>

            {getVisiblePages().map((page, index) => (
                page === '...' ? (
                    <Button key={`ellipsis-${index}`} variant="ghost" disabled>
                        ...
                    </Button>
                ) : (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </Button>
                )
            ))}

            <Button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    );
};




const TestHistory: React.FC = () => {
    const navigate = useNavigate();
    const { token, user} = useAuth();

    const [testHistoryDashboardData, setTestHistoryDashboardData] = useState<TestHistoryDashboardData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [testHistory, setTestHistory] = useState<TestHistoryType[]>([]);
    const [isTestHistoryLoading, setIsTestHistoryLoading] = useState<boolean>(true);

    const fetchTestHistoryDashboardData = async (userId: string) => {
        if (!userId) return;

        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/student/test/history-dashboard/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                const dashboardData: TestHistoryDashboardData = data.data.dashboard;
                setTestHistoryDashboardData(dashboardData);
            } else {
                console.error('API Error:', data.message);
                setTestHistoryDashboardData(undefined);
            }
        } catch (error) {
            console.error('Error fetching dashboard test history:', error);
            setTestHistoryDashboardData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTestHistoryData = async (userId: string) => {
        if (!userId) return;

        setIsTestHistoryLoading(true);

        try {
            const res = await fetch(`${API_BASE}/student/test/history/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                const history: TestHistoryType[] = data.data.testHistory;
                setTestHistory(history);
            } else {
                console.error('API Error:', data.message);
                setTestHistory([]); // optional fallback
            }
        } catch (error) {
            console.error('Error fetching test history:', error);
            setTestHistory([]);
        } finally {
            setIsTestHistoryLoading(false);
        }
    };


    useEffect(()=>{
        if(!user || !token){
            return;
        }

        fetchTestHistoryDashboardData(user.id);
        fetchTestHistoryData(user.id);

    }, [user, token]);


    // Filters Option 
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const formatCustomDate = (dateString: string) => {
        const date = new Date(dateString);

        const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();

        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        return `${time} on ${day} ${month}, ${year}`;
    };

    const filterTestHistory = (data: TestHistoryType[], query: string, status: string): TestHistoryType[] => {
        const loweredQuery = query.trim().toLowerCase();

        let filtered = data;

        if (loweredQuery) {
            filtered = filtered.filter(test =>
                test.name.toLowerCase().includes(loweredQuery) ||
                test.courseName.toLowerCase().includes(loweredQuery) ||
                test.topicName.toLowerCase().includes(loweredQuery)
            );
        }

        if (status) {
            filtered = filtered.filter(test => test.testStatus === status);
        }

        return filtered.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    };

    // Pagination for Table
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage, setTestsPerPage] = useState<number>(10);


    // Place this above the return or rendering block
    const filteredTests = filterTestHistory(testHistory, searchQuery, statusFilter);
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

    if (!user) {
        navigate('/auth');
        return;
    }


    return (
        <DashboardLayout
            breadcrumbItems={[
                { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
                { label: `Test-History`, isCurrentPage: true },
            ]}
        >
            <div className='p-6 sm:p-2 md:p-4 lg:p-6 xl:p-8 space-y-4'>
                {/* Header profile of User */}
                <div className="flex items-center justify-between w-full px-4 py-3 rounded-lg shadow-sm border sm:px-6">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 bg-green-800 text-2xl font-semibold">
                            <AvatarFallback className="bg-green-800 text-white">
                                {user.name?.trim().split(" ").slice(0, 2).map(p => p[0].toUpperCase()).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">{user.name}</span>
                            <span className="text-sm sm:text-md font-mono text-gray-700 mt-1">
                                email:{" "}
                                <span className="rounded px-1 py-0.5 bg-gray-100 text-gray-600">
                                    {user.email}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Right: Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                                👤 View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/courses/:progress')}>
                                📘 Explore Courses
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <>
                    {
                        isLoading ?
                            <div className="flex items-center justify-center w-full min-h-10">
                                <LoadingSpinnerWithoutHight />
                            </div>
                            :
                            <>
                                {/* Dashboard for user */}
                                <div className='p-4 border'>
                                    <div className="mb-4">
                                        <h1 className="font-semibold text-xl sm:text-2xl">📊 Quick Statistics</h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Overview of your test activity</p>
                                    </div>

                                    {
                                        testHistoryDashboardData &&

                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="flex items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <CheckCircle className="text-green-500 w-6 h-6 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tests Attempted</p>
                                                        <h2 className="text-lg font-semibold">{testHistoryDashboardData.testAttempted || 0}</h2>
                                                    </div>
                                                </div>

                                                <div className="flex items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <BarChart2 className="text-blue-500 w-6 h-6 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Questions Solved</p>
                                                        <h2 className="text-lg font-semibold">{testHistoryDashboardData.questionsSolved || 0}</h2>
                                                    </div>
                                                </div>

                                                <div className="flex items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <BookOpen className="text-yellow-500 w-6 h-6 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Courses Enrolled</p>
                                                        <h2 className="text-lg font-semibold">{testHistoryDashboardData.coursesEnrolled || 0}</h2>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    <div className="lg:col-span-2">
                                                        <TestsAttempted
                                                            data={testHistoryDashboardData.monthWiseTestAttempted}
                                                        />
                                                    </div>

                                                    <div className="lg:col-span-1">
                                                        <CorrectAnswers
                                                            correctQuestions={testHistoryDashboardData.correctQuestions || 0}
                                                            wrongQuestions={testHistoryDashboardData.wrongQuestions || 0}
                                                            skippedQuestions={testHistoryDashboardData.unansweredQuestions || 0}
                                                            para={"Question wise analysis for the Questions you attempted"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>

                                {/* main History */}
                                <div className='mt-6'>
                                    <div className="mb-4">
                                        <h1 className="font-semibold text-lg sm:text-md">Test History</h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Here you will see you Test history..</p>
                                    </div>

                                    <div className='space-y-2'>
                                        <div className='py-2 border-b flex justify-between'>
                                            <div className="relative w-full max-w-[300px]">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                    <Search className="h-5 w-5" />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Search tests..."
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setCurrentPage(1); // Reset to page 1
                                                    }}

                                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>

                                            <div className='pr-6'>
                                                <select
                                                    onChange={(e) => {
                                                        setStatusFilter(e.target.value);
                                                        setCurrentPage(1); // Reset to page 1
                                                    }}
                                                    className="border px-3 py-2 rounded-lg dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="all">All Statuses</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="not_started">Not Started</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="border shadow-sm w-full">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-100 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-4 py-3 font-semibold">Test Details</th>
                                                        <th className="px-4 py-3 font-semibold">Topic</th>
                                                        <th className="px-4 py-3 font-semibold">Score</th>
                                                        <th className="px-4 py-3 font-semibold">Attempted At</th>
                                                        <th className="px-4 py-3 font-semibold">Status</th>
                                                        <th className="px-4 py-3 font-semibold">Check</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        isTestHistoryLoading ?
                                                            <tr>
                                                                <td colSpan={6} className="py-6 flex items-center justify-center w-full min-h-10">
                                                                    <LoadingSpinnerWithoutHight />
                                                                </td>
                                                            </tr>
                                                            :
                                                            testHistory && testHistory.length > 0 ?
                                                                <>
                                                                    {

                                                                        filteredTests.length > 0 ? (
                                                                            currentTests.map((test) => (
                                                                                <tr key={test.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                                    {/* Test details */}
                                                                                    <td className="px-4 py-3">
                                                                                        <div className="font-semibold">{test.name}</div>
                                                                                        <div className="text-gray-500">
                                                                                            {test.courseName}
                                                                                        </div>
                                                                                    </td>

                                                                                    {/* Topic */}
                                                                                    <td className="px-4 py-3">
                                                                                        {test.topicName}
                                                                                    </td>

                                                                                    {/* Score */}
                                                                                    <td className="px-4 py-3">
                                                                                        {test.marksScored} / {test.totalMarks}
                                                                                    </td>

                                                                                    {/* Time */}
                                                                                    <td className="px-4 py-3">
                                                                                        <span>{formatCustomDate(test.updatedAt)}</span>
                                                                                    </td>

                                                                                    {/* Status */}
                                                                                    <td className="px-4 py-3 capitalize">
                                                                                        <div className="flex">
                                                                                            <div
                                                                                                className={`px-2 py-1 rounded text-md font-medium ${test.testStatus === "completed"
                                                                                                    ? "bg-green-100 text-green-600"
                                                                                                    : test.testStatus === "in_progress"
                                                                                                        ? "bg-yellow-100 text-yellow-600"
                                                                                                        : "bg-gray-100 text-gray-500"
                                                                                                    }`}
                                                                                            >
                                                                                                {test.testStatus.replace("_", " ")}
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>

                                                                                    {/* Redirect */}
                                                                                    <td className="px-4 py-3 text-blue-600">
                                                                                        <Link to={`/student/user/course/test/${test.testId}`}>
                                                                                            <Button className="rounded-full bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1 text-sm sm:text-base">
                                                                                                Checkout
                                                                                            </Button>
                                                                                        </Link>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={6} className="text-center text-gray-500 py-6">
                                                                                    No tests found matching your search.
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                </>
                                                                :
                                                                <tr>
                                                                    <td colSpan={6} className="py-6 text-center text-gray-500">
                                                                        You haven't attempted any test yet
                                                                    </td>
                                                                </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex justify-between items-center">

                                            <div className="flex justify-end mt-2">
                                                <select
                                                    value={testsPerPage}
                                                    onChange={(e) => {
                                                        setTestsPerPage(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="border rounded px-3 py-1 text-sm"
                                                >
                                                    <option value={10}>10 per page</option>
                                                    <option value={25}>25 per page</option>
                                                    <option value={50}>50 per page</option>
                                                </select>
                                            </div>


                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={Math.ceil(filteredTests.length / testsPerPage)}
                                                onPageChange={(page) => setCurrentPage(page)}
                                                maxVisible={3} // Adjust how many page numbers to show
                                            />

                                            <div className="text-sm text-gray-500">
                                                Showing {Math.min(indexOfFirstTest + 1, filteredTests.length)} to {Math.min(indexOfLastTest, filteredTests.length)} out off {filteredTests.length} results
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </>
            </div>
        </DashboardLayout>
    )
}

export default TestHistory;
