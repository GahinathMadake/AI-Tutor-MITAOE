import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, BookOpen, Search, ChevronRight, MoreVertical, Play, CalendarDays, User as UserIcon, School as SchoolIcon, ArrowLeft, Clock, FileText, HelpCircle, Home, Loader, UserPlus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion } from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Link, useParams } from 'react-router-dom';
import type { CourseEnrollmentType, School, Semester } from '@/types/StudentSiteHome';
import { SemesterTabs, type SemesterTab } from '@/types/StudentSiteHome';
import { LoadingSpinnerWithoutHight } from '@/components/layout/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CourseCard from './common/CourseCard';
import { useStudentSiteHome } from '@/hooks/useStudentSiteHome';
import { useCourseEnrollContext } from '@/hooks/useStudentCourseEnroll';

export const CourseEnroll = () => {
    const { courseId = '', schoolId = '' } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState<CourseEnrollmentType>();
    const [loading, setLoading] = useState<boolean>(true);

    const { fetchCourseById, enrollInCourse } = useCourseEnrollContext();


    const loadCourse = async () => {
        setLoading(true);
        const fetchedCourse = await fetchCourseById(courseId);
        setCourse(fetchedCourse);
        setTimeout(() => setLoading(false), 500);
    };

    useEffect(() => {
        if (!courseId) return;
        loadCourse();
    }, [courseId]);


    // Enrolling Details
    const [enrollmentKey, setEnrollmentKey] = useState<string>('');
    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState('');


    const EnrollMeInCourse = async (courseId: string, enrollmentKey: string) => {
        setEnrolling(true);
        setEnrollmentError('');

        if (!enrollmentKey) {
            setEnrollmentError('Enrollment Key is Required');
            setEnrolling(false);
            return;
        }

        const result = await enrollInCourse(courseId, enrollmentKey);
        if (!result.success) {
            setEnrollmentError(result.message || 'Failed to enroll');
        }
        else{
            setEnrollmentError(result.message || "Successfully Enrolled");
            loadCourse();
        }

        setEnrolling(false);
    };

    return (
        <DashboardLayout
            breadcrumbItems={[
                { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
                { label: `Site-Home - ${schoolId}`, isCurrentPage: false, href: `/Site-Home/${schoolId}` },
                { label: `Enroll - ${courseId}`, isCurrentPage: true },
            ]}
        >
            {
                loading ?
                    <div className="flex items-center justify-center w-full min-h-[90vh]">
                        <LoadingSpinnerWithoutHight />
                    </div>
                    :
                    (!course || Object.keys(course).length === 0 ?
                        (
                            <div className="flex items-center justify-center w-full min-h-[90vh]">
                                <div className="max-w-[500px] min-w-[375px] flex flex-col items-center justify-center gap-6 text-center p-8">
                                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            Course Not Found
                                        </h2>
                                        <p className="text-muted-foreground max-w-md">
                                            We couldn't find the course you're looking for. It may have been removed or the URL might be incorrect.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button asChild variant="outline">
                                            <Link to="/student/sitehome">
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Browse All Courses
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link to="/student">
                                                <Home className="w-4 h-4 mr-2" />
                                                Return Home
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className="w-full p-4 sm:p-2 md:p-4 lg:p-6">
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-3xl font-bold">{course.name}</CardTitle>
                                                <CardDescription className="text-lg mt-2">
                                                    {course.description || "No description available"}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="text-sm">
                                                {course.enrollments?.length} enrolled
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="mt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3">
                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Instructor</p>
                                                    <p className="font-medium">{course.instructorName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <SchoolIcon className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">School</p>
                                                    <p className="font-medium">{course.schoolName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Semester</p>
                                                    <p className="font-medium">{course.semesterName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-4" />

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                                                <BookOpen className="text-red-500 w-8 h-8" />
                                                <p className="text-xl mt-2">{course.totalChapters || 0}</p>
                                                <p className="text-sm">Total Chapters</p>
                                            </div>

                                            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                                                <FileText className="text-blue-500 w-8 h-8" />
                                                <p className="text-xl mt-2">{course.totalChapters || 0}</p>
                                                <p className="text-sm">Tests</p>
                                            </div>

                                            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                                                <HelpCircle className="text-green-500 w-8 h-8" />
                                                <p className="text-xl mt-2">{course.totalQuestions || 0}</p>
                                                <p className="text-sm">Questions</p>
                                            </div>

                                            <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                                                <Clock className="text-purple-500 w-8 h-8" />
                                                <p className="text-xl mt-2">
                                                    {new Date(course.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm">Created</p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col gap-4">
                                        {
                                            user && course?.enrollments?.some(enrollment => enrollment.studentId === user.id)
                                                ?
                                                (
                                                    <div className="my-4 w-full flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                            {/* <CheckCircle className="h-5 w-5" /> */}
                                                            <span>You're enrolled in this course</span>
                                                        </div>
                                                        <Button asChild className="w-full max-w-xs">
                                                            <Link to={`/student/course/${course.id}`}>Continue Learning</Link>
                                                        </Button>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div className="w-full border rounded-lg bg-background p-6 space-y-6">
                                                        <div className="space-y-3">
                                                            <h3 className="text-2xl font-bold tracking-tight">{course?.name}</h3>
                                                            <p className="text-muted-foreground">
                                                                {"Join this course to enhance your skills"}
                                                            </p>
                                                        </div>

                                                        <Separator />

                                                        <div className="flex gap-3 flex-wrap">
                                                            <Input
                                                                id="enrollmentKey"
                                                                name="enrollmentKey"
                                                                type="text"
                                                                value={enrollmentKey}
                                                                onChange={(e) => setEnrollmentKey(e.target.value)}
                                                                placeholder="Course access key"
                                                                className="max-w-xs flex-1 min-w-[200px]"
                                                            />
                                                            <Button
                                                                onClick={() => { EnrollMeInCourse(courseId, enrollmentKey) }}
                                                                className="flex-shrink-0 gap-2"
                                                                disabled={enrolling}
                                                            >
                                                                {enrolling ? (
                                                                    <>
                                                                        <Loader className="h-4 w-4 animate-spin" />
                                                                        Enrolling...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserPlus className="h-4 w-4" />
                                                                        Enroll Now
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {enrollmentError && (
                                                            <p className="text-red-500 text-sm">{enrollmentError}</p>
                                                        )}
                                                    </div>
                                                )
                                        }
                                    </CardFooter>
                                </Card>
                            </div>
                        )
                    )

            }
        </DashboardLayout>
    )
}


export const SemesterCard: React.FC<{ semester: Semester, schoolId: string }> = ({ semester, schoolId }) => {
    return (
        <div className="my-2">
            <Collapsible>
                <CollapsibleTrigger className="w-full block group/collapsible">
                    <div className="w-full px-4 py-3 bg-sidebar-accent hover:bg-sidebar rounded-lg shadow-sm flex border items-center gap-3">
                        <Play className="w-[20px]" />
                        <div>
                            <p className="font-medium text-base">{semester.name}</p>
                        </div>
                        <ChevronRight className="w-[20px] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="px-4">
                        {semester.courses.length > 0 ? (
                            <Accordion type="single" collapsible>
                                <div className='my-6 flex flex-wrap gap-6'>
                                    {semester.courses.map((course) => (
                                        <Link to={`/Site-Home/${schoolId}/enroll/${course.id}`}>
                                            <CourseCard course={course} />
                                        </Link>
                                    ))}
                                </div>
                            </Accordion>
                        ) : (
                            <p className="text-sm text-gray-400 italic py-2">No courses available.</p>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};


const SiteHome: React.FC = () => {
    const { schoolId } = useParams<{ schoolId: string }>();
    const { semesters, isSemesterLoading, fetchSchoolById } = useStudentSiteHome();

    const [school, setSchool] = useState<School>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchSchoolDetails = async (schoolId: string) => {
        if (!schoolId) return;
        setIsLoading(true);
        const data = await fetchSchoolById(schoolId);
        setSchool(data);
        setTimeout(() => setIsLoading(false), 500);
    };

    useEffect(() => {
        if (!schoolId) return;
        fetchSchoolDetails(schoolId);
    }, [schoolId]);



    /*------------------------- Search Query Optimisation -------------------------*/
    const [initialTab, setInitialTab] = useState<SemesterTab>('all-semesters');
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getFilteredUsers = () => {
        if (school === undefined) return [];
        if (!searchQuery.trim()) return school.users;


        const lowerQuery = searchQuery.toLowerCase();

        return school.users.filter((user) =>
            user.name.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery) ||
            user.prn.toString().includes(lowerQuery) ||
            user.role.toLowerCase().includes(lowerQuery)
        );
    };


    return (
        <DashboardLayout
            breadcrumbItems={[
                { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
                { label: `Site-Home - ${schoolId}`, isCurrentPage: true },
            ]}
        >
            {
                isLoading ?
                    <div className='w-full h-40 flex items-center justify-center'>
                        <LoadingSpinnerWithoutHight />
                    </div>
                    :
                    <div className="p-6 sm:p-2 md:p-4 lg:p-6">
                        <div className="border rounded-md w-full space-y-4">
                            {
                                school ?
                                    <>
                                        <div className="p-4 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                            <div className='flex justify-between'>
                                                <div>
                                                    <h1 className="text-3xl font-bold text-gray-700 dark:text-white">{school.name}</h1>
                                                    <p className="mt-1 italic text-sm text-gray-500 dark:text-gray-400">
                                                        Created on{" "}
                                                        {new Date(school.createdAt).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Dropdown menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem
                                                            onClick={() => console.log("Navigate to users")}
                                                        >
                                                            See All Users
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => console.log("Navigate to courses")}
                                                        >
                                                            All Courses
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Users className="w-4 h-4" />
                                                    <span>{school.users.length} Users</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{school.numberOfCourses || 0} Courses</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-6'>
                                            <div className="px-4 flex justify-between items-center border-b gap-6">
                                                <div className='flex gap-4'>
                                                    <span
                                                        className={`pb-2 font-semibold cursor-pointer hover:text-blue-700 ${initialTab === 'all-semesters'
                                                            ? 'border-b-4 border-blue-700 text-blue-700'
                                                            : 'text-red-500'
                                                            }`}
                                                        onClick={() => setInitialTab('all-semesters')}
                                                    >
                                                        All Semesters
                                                    </span>

                                                    <span
                                                        className={`pb-2 font-semibold cursor-pointer hover:text-blue-700 ${initialTab === 'all-users'
                                                            ? 'border-b-4 border-blue-700 text-blue-700'
                                                            : 'text-red-500'
                                                            }`}
                                                        onClick={() => setInitialTab('all-users')}
                                                    >
                                                        Users
                                                    </span>
                                                </div>

                                                {initialTab === SemesterTabs.AllUsers && (
                                                    <div className="relative bottom-1 w-64">
                                                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                                            <Search className="w-4 h-4" />
                                                        </span>
                                                        <Input
                                                            type="text"
                                                            placeholder="Search User"
                                                            className="pl-10"
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {
                                                initialTab === SemesterTabs.AllSemesters &&
                                                (isSemesterLoading ?
                                                    <div className="flex items-center justify-center h-32">
                                                        <LoadingSpinnerWithoutHight />
                                                    </div>
                                                    :
                                                    <div className="p-4">
                                                        {semesters.length === 0 ? (
                                                            <div className="text-center text-muted-foreground text-sm">
                                                                <CalendarDays className="mx-auto mb-2 h-6 w-6" />
                                                                No semesters available
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {semesters.map((semester) => (
                                                                    <SemesterCard key={semester.id} semester={semester} schoolId={school.id} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            }

                                            {
                                                initialTab === SemesterTabs.AllUsers &&
                                                <div className="p-4">
                                                    <h2 className="text-xl font-semibold mb-4">All Users</h2>

                                                    {school.users.length === 0 ? (
                                                        <div className="text-center text-gray-500 dark:text-gray-400">
                                                            <p className="text-md">No users found in this school.</p>
                                                        </div>
                                                    ) : (
                                                        <table className="min-w-full border rounded-md overflow-hidden">
                                                            <thead>
                                                                <tr className="bg-gray-100 dark:bg-gray-800">
                                                                    <th className="px-4 py-2 text-left">Name</th>
                                                                    <th className="px-4 py-2 text-left">PRN</th>
                                                                    <th className="px-4 py-2 text-left">Email</th>
                                                                    <th className="px-4 py-2 text-left">Role</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {getFilteredUsers().length > 0 ? (
                                                                    getFilteredUsers().map((user) => (
                                                                        <tr key={user.id} className="border-t">
                                                                            <td className="px-4 py-2">{user.name}</td>
                                                                            <td className="px-4 py-2">{user.prn}</td>
                                                                            <td className="px-4 py-2">{user.email}</td>
                                                                            <td className="px-4 py-2 capitalize">{user.role.toLowerCase()}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                                                            No users found matching your search.
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            }

                                        </div>
                                    </>
                                    :
                                    <div className="p-6 text-center bg-white dark:bg-gray-900 rounded-xl shadow-md">
                                        <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-400">School Not Found</h1>
                                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-md">
                                            The school you are looking for either doesn't exist or has been removed.
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Please double-check the URL or return to the homepage.
                                        </p>
                                        <div className="mt-4">
                                            <Link
                                                to="/dashboard"
                                                className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                            >
                                                Go to Home
                                            </Link>
                                        </div>
                                    </div>

                            }
                        </div>
                    </div>
            }

        </DashboardLayout >
    )
}

export default SiteHome;

