import { Response } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse, AuthenticatedRequest } from '../types/auth';

class StudentCourseController {

    async getCourseDetailsForEnrollement(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { schoolId } = req.params;

        console.log("Fetching school details for user:", user.id, "School ID:", schoolId);


        const course = {
            id: "course-101",
            name: "Full Stack Web Development",
            description: "Master web development using MERN stack.",
            enrollmentKey: "FSWD2025",
            teacher: {
                id: "teacher-1",
                name: "Prof. Rohan Kulkarni",
            },
            school: {
                id: "school-1",
                name: "MIT Academy of Engineering",
            },
            semester: {
                id: "sem-1",
                name: "Semester 5",
            },
            createdAt: new Date("2024-11-01T10:00:00Z"),
            chapters: [
                { id: "ch-1", name: "HTML & CSS" },
                { id: "ch-2", name: "JavaScript" },
                { id: "ch-3", name: "React.js" },
            ],
            tests: [
                { id: "test-1", title: "React Basics" },
                { id: "test-2", title: "Node Fundamentals" },
            ],
            questions: [
                { id: "q1", text: "Explain useEffect in React." },
                { id: "q2", text: "What is Express.js?" },
                { id: "q3", text: "Difference between var, let, and const?" },
            ],
            enrollments: [
                {
                    id: "enr-1",
                    courseId: "course-101",
                    studentId: "student-007", // match with your current logged-in user
                },
                {
                    id: "enr-2",
                    courseId: "course-101",
                    studentId: "student-011",
                },
            ],
        };

        const response: ApiResponse = {
            success: true,
            data: { course }
        };

        res.status(200).json(response);
    }

    async EnrollMeInTheCourse(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { schoolId } = req.params;

        console.log("Fetching details for user:", user.id, "Course ID:", schoolId);

        const response: ApiResponse = {
            success: true,
            message: "User Succeefully Enrolled in the Course",
        };

        res.status(200).json(response);
    }


    async getCoursesByProgress(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { Progress } = req.params;

        console.log("Fetching details for user:", user.id, "Course Progress =", Progress);


        const courses = [
            {
                id: "course-001",
                name: "Data Structures & Algorithms",
                description:
                    "Learn the fundamentals of data structures and algorithms including arrays, linked lists, stacks, queues, trees, and sorting algorithms.",
                enrollmentKey: "DSA123",
                teacherId: "teacher-001",
                schoolId: "school-001",
                semesterId: "semester-001",
                createdAt: new Date("2024-06-01"),

                // Relations
                teacher: {
                    id: "teacher-001",
                    name: "Dr. Anita Sharma",
                    username: "anita.sharma",
                    prn: 12345678,
                    email: "anita.sharma@example.com",
                    password: "hashed-password",
                    role: "TEACHER",
                    schoolId: "school-001",
                    createdAt: new Date("2022-01-15"),
                    teachingCourses: [],
                    enrollments: [],
                    createdTests: [],
                    createdQuestions: [],
                    testStatuses: [],
                    testSubmissions: [],
                    notifications: [],
                },
                school: {
                    id: "school-001",
                    name: "Springfield College of Engineering",
                    createdAt: new Date("2020-08-01"),
                    users: [],
                    courses: [],
                },
                semester: {
                    id: "semester-001",
                    name: "Fall 2025",
                    createdAt: new Date("2025-07-01"),
                    courses: [],
                },
                chapters: [],
                enrollments: [
                    { id: "enroll-1", studentId: "stu-001", courseId: "course-001", enrolledAt: new Date() },
                    { id: "enroll-2", studentId: "stu-002", courseId: "course-001", enrolledAt: new Date() },
                ],
                tests: [],
                questions: [],
            },

            {
                id: "course-002",
                name: "Introduction to Web Development",
                description:
                    "Explore the basics of HTML, CSS, and JavaScript and build modern web interfaces using React.",
                enrollmentKey: "WEB456",
                teacherId: "teacher-002",
                schoolId: "school-001",
                semesterId: "semester-002",
                createdAt: new Date("2024-07-15"),

                teacher: {
                    id: "teacher-002",
                    name: "Mr. Ramesh Kulkarni",
                    username: "ramesh.kulkarni",
                    prn: 87654321,
                    email: "ramesh.kulkarni@example.com",
                    password: "hashed-password",
                    role: "TEACHER",
                    schoolId: "school-001",
                    createdAt: new Date("2021-03-10"),
                    teachingCourses: [],
                    enrollments: [],
                    createdTests: [],
                    createdQuestions: [],
                    testStatuses: [],
                    testSubmissions: [],
                    notifications: [],
                },
                school: {
                    id: "school-001",
                    name: "Springfield College of Engineering",
                    createdAt: new Date("2020-08-01"),
                    users: [],
                    courses: [],
                },
                semester: {
                    id: "semester-002",
                    name: "Spring 2026",
                    createdAt: new Date("2026-01-01"),
                    courses: [],
                },
                chapters: [],
                enrollments: [
                    { id: "enroll-3", studentId: "stu-003", courseId: "course-002", enrolledAt: new Date() },
                ],
                tests: [],
                questions: [],
            },
        ];


        const response: ApiResponse = {
            success: true,
            data: { courses },
        };

        res.status(200).json(response);
    }

    async getWholeCourseByID(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const { courseId } = req.query;
        console.log("Fetching course details for user:", user.id, "Course ID:", courseId);


        const course =
        {
            id: "course-001",
            name: "Data Structures & Algorithms",
            description:
                "Learn the fundamentals of data structures and algorithms including arrays, linked lists, stacks, queues, trees, and sorting algorithms.",
            enrollmentKey: "DSA123",
            teacherId: "teacher-001",
            schoolId: "school-001",
            semesterId: "semester-001",
            createdAt: new Date("2024-06-01"),

            // Relations
            teacher: {
                id: "teacher-001",
                name: "Dr. Anita Sharma",
            },
            school: {
                id: "school-001",
                name: "Springfield College of Engineering",
            },
            semester: {
                id: "semester-001",
                name: "Fall 2025",
                createdAt: new Date("2025-07-01"),
                courses: [],
            },
            chapters: [
                {
                    id: "chapter-001",
                    name: "Introduction to Data Structures",
                    courseId: "course-001",
                    createdAt: new Date("2024-06-05"),
                    course: {} as any,
                    topics: [
                        {
                            id: "topic-001",
                            name: "What are Data Structures?",
                            chapterId: "chapter-001",
                            createdAt: new Date("2024-06-06"),
                            chapter: {} as any,
                            tests: [
                                {
                                    id: "test-001",
                                    name: "Midterm Assessment",
                                    description: "Covers topics from Week 1 to Week 4.",
                                    topicId: "topic-001",
                                    courseId: "course-001",
                                    teacherId: "teacher-001",
                                    createdAt: new Date("2025-07-01T10:00:00Z"),
                                    durationMinutes: 60,
                                    totalMarks: 50,
                                    startTime: new Date("2025-07-10T09:00:00Z"),
                                    endTime: new Date("2025-07-10T10:00:00Z"),
                                    isPublished: true,
                                    questions: [],
                                    submissions: [],
                                },
                                {
                                    id: "test-002",
                                    name: "Quiz: Sorting Algorithms",
                                    description: "Short quiz on quicksort, mergesort, and heapsort.",
                                    topicId: "topic-001",
                                    courseId: "course-001",
                                    teacherId: "teacher-001",
                                    createdAt: new Date("2025-07-05T12:30:00Z"),
                                    durationMinutes: 30,
                                    totalMarks: 20,
                                    startTime: new Date("2025-07-15T14:00:00Z"),
                                    endTime: new Date("2025-07-15T14:30:00Z"),
                                    isPublished: false,
                                    questions: [],
                                    submissions: [],
                                },
                                {
                                    id: "test-003",
                                    name: "Final Test - DSA",
                                    description: "Comprehensive test covering all course content.",
                                    topicId: "topic-001",
                                    courseId: "course-001",
                                    teacherId: "teacher-001",
                                    createdAt: new Date("2025-07-20T08:00:00Z"),
                                    durationMinutes: 90,
                                    totalMarks: 100,
                                    startTime: new Date("2025-07-25T09:00:00Z"),
                                    endTime: new Date("2025-07-25T10:30:00Z"),
                                    isPublished: true,
                                    questions: [],
                                    submissions: [],
                                }
                            ],
                        },
                        {
                            id: "topic-002",
                            name: "Types of Data Structures",
                            chapterId: "chapter-001",
                            createdAt: new Date("2024-06-06"),
                            chapter: {} as any,
                            tests: [],
                        },
                    ],
                },
                {
                    id: "chapter-002",
                    name: "Arrays and Linked Lists",
                    courseId: "course-001",
                    createdAt: new Date("2024-06-07"),
                    course: {} as any,
                    topics: [
                        {
                            id: "topic-003",
                            name: "Array Operations",
                            chapterId: "chapter-002",
                            createdAt: new Date("2024-06-08"),
                            chapter: {} as any,
                            tests: [],
                        },
                        {
                            id: "topic-004",
                            name: "Singly and Doubly Linked Lists",
                            chapterId: "chapter-002",
                            createdAt: new Date("2024-06-08"),
                            chapter: {} as any,
                            tests: [],
                        },
                    ],
                },
                {
                    id: "chapter-003",
                    name: "Stacks and Queues",
                    courseId: "course-001",
                    createdAt: new Date("2024-06-10"),
                    course: {} as any,
                    topics: [
                        {
                            id: "topic-005",
                            name: "Stack Implementation",
                            chapterId: "chapter-003",
                            createdAt: new Date("2024-06-11"),
                            chapter: {} as any,
                            tests: [],
                        },
                        {
                            id: "topic-006",
                            name: "Queue and Deque",
                            chapterId: "chapter-003",
                            createdAt: new Date("2024-06-11"),
                            chapter: {} as any,
                            tests: [],
                        },
                    ],
                },
                {
                    id: "chapter-004",
                    name: "Trees and Graphs",
                    courseId: "course-001",
                    createdAt: new Date("2024-06-15"),
                    course: {} as any,
                    topics: [
                        {
                            id: "topic-007",
                            name: "Binary Trees and Traversals",
                            chapterId: "chapter-004",
                            createdAt: new Date("2024-06-16"),
                            chapter: {} as any,
                            tests: [],
                        },
                        {
                            id: "topic-008",
                            name: "Graph Representations",
                            chapterId: "chapter-004",
                            createdAt: new Date("2024-06-16"),
                            chapter: {} as any,
                            tests: [],
                        },
                    ],
                },
            ],
            enrollments: [
                { id: "enroll-1", studentId: "stu-001", courseId: "course-001", enrolledAt: new Date() },
                { id: "enroll-2", studentId: "stu-002", courseId: "course-001", enrolledAt: new Date() },
            ],
            tests: [],
            questions: [],
        };

        const enrollment = {
            id: "enroll-001",
            studentId: "user-123",
            courseId: "course-456",
            status: "ENROLLED", // assuming enum: "ENROLLED" | "COMPLETED" | etc.
            completedTestIds: ["test-101", "test-102"],
            enrolledAt: new Date("2024-08-01"),
        };



        const response: ApiResponse = {
            success: true,
            data: { course, enrollment },
        };

        res.status(200).json(response);
    }

}


export const studentCoursesController = new StudentCourseController();