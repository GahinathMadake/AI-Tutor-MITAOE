import React, { createContext, useState } from 'react';
import type { SingleCourseType, EnrollmentType } from '@/types/studentCourse';
import { API_BASE } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface CourseCacheEntry {
  course: SingleCourseType;
  enrollment: EnrollmentType;
}

interface SingleCourseContextType {
  getSingleCourse: (courseId: string) => Promise<CourseCacheEntry | undefined>;
}

export const SingleCourseContext = createContext<SingleCourseContextType | undefined>(undefined);


export const SingleCourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courseCache] = useState<Map<string, CourseCacheEntry>>(new Map());
  const { token } = useAuth();

  const getSingleCourse = async (courseId: string): Promise<CourseCacheEntry | undefined> => {
    if (!token) {
      console.warn('Token missing');
      return;
    }

    if (courseCache.has(courseId)) {
      return courseCache.get(courseId);
    }

    try {
      const response = await fetch(`${API_BASE}/student/course/get-whole-course?courseId=${courseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        const data: CourseCacheEntry = {
          course: result.data.course,
          enrollment: result.data.enrollment,
        };

        console.log(data);
        courseCache.set(courseId, data);
        return data;
      } else {
        console.error('API error:', result.message);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
    }

    return undefined;
  };

  return (
    <SingleCourseContext.Provider value={{ getSingleCourse }}>
      {children}
    </SingleCourseContext.Provider>
  );
};
