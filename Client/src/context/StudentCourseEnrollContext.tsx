import React, { createContext } from 'react';
import { API_BASE } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import type { CourseEnrollContextType, CourseEnrollmentType } from '@/types/StudentSiteHome';

export const CourseEnrollContext = createContext<CourseEnrollContextType | undefined>(undefined);

const courseCache = new Map<string, CourseEnrollmentType>();

export const CourseEnrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();

  const fetchCourseById = async (id: string): Promise<CourseEnrollmentType | undefined> => {
    if (!token) return;

    if (courseCache.has(id)) {
      return courseCache.get(id);
    }

    try {
      const res = await fetch(`${API_BASE}/student/course/get-course-details/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        const course: CourseEnrollmentType = data.data.course;
        courseCache.set(id, course);
        return course;
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }

    return undefined;
  };

  const enrollInCourse = async (courseId: string, enrollmentKey: string): Promise<{ success: boolean; message?: string }> => {
    if (!token) return { success: false, message: 'Unauthorized' };

    if (!enrollmentKey.trim()) {
      return { success: false, message: 'Enrollment Key is required' };
    }

    try {
      const res = await fetch(`${API_BASE}/student/course/enroll-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, enrollmentKey: enrollmentKey.trim() }),
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        return { success: true, message: "Successfully enrolled into Course!" };
      } else {
        // Extract only the first line of the stack trace
        const rawMessage = data.stack || 'Enrollment failed';
        const firstLine = rawMessage.split('\n')[0].replace('Error: ', '').trim();

        return { success: false, message: firstLine || 'Enrollment failed' };
      }
    } catch (error: any) {
      console.error('Enrollment error:', error);
      return { success: false, message: error?.message || 'Enrollment failed' };
    }
  };

  return (
    <CourseEnrollContext.Provider value={{ fetchCourseById, enrollInCourse }}>
      {children}
    </CourseEnrollContext.Provider>
  );
};