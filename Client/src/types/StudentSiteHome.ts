import type { CourseCard } from "./studentCourse";

export const SemesterTabs = {
  AllSemesters: "all-semesters",
  AllUsers: "all-users",
  AllCourses: "all-courses",
} as const;

export type SemesterTab = typeof SemesterTabs[keyof typeof SemesterTabs];


export interface School{
  id: string;
  name: string;
  createdAt: string;
  users: SchoolUser[];
  numberOfCourses: number;
}

export interface SchoolUser {
  id: string;
  name: string;
  prn: string;
  email: string;
  role: string;
}

export interface Semester {
  id: string;
  name: string;
  courses:CourseCard[],
}


export interface CourseEnrollmentType {
  id: string;
  name: string;
  description: string;
  createdAt: string;

  semesterName: string;
  schoolName: string;
  instructorName: string;

  totalChapters: number;
  totalTests: number;
  totalQuestions: number;

  enrollments?: {
    id: string;
    studentId: string;
    enrollment_status: string;
  }[];
}


export type studentSiteHomeContextType = {
    semesters: Semester[];
    isSemesterLoading: boolean;
    fetchSchoolById: (schoolId: string) => Promise<School | undefined>;
};


export type CourseEnrollContextType = {
  fetchCourseById: (id: string) => Promise<CourseEnrollmentType | undefined>;
  enrollInCourse: (courseId: string, key: string) => Promise<{ success: boolean; message?: string }>;
};
