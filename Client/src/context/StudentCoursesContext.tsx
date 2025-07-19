import React, { createContext, useState } from 'react';
import type { CourseCard as CourseCardType } from '@/types/studentCourse';
import { API_BASE } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface CourseContextType {
  coursesCache: Map<string, CourseCardType[]>;
  fetchCoursesByProgress: (progress: string) => Promise<CourseCardType[]>;
}

export const CoursesContext = createContext<CourseContextType | undefined>(undefined);

export const StudentCoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [coursesCache, setCoursesCache] = useState<Map<string, CourseCardType[]>>(new Map());

  const fetchCoursesByProgress = async (progress: string): Promise<CourseCardType[]> => {
    if (!token) return [];

    // Return cached if exists
    if (coursesCache.has(progress)) {
      return coursesCache.get(progress)!;
    }

    try {
      const response = await fetch(`${API_BASE}/student/course/get-user-course-by-progress/${progress}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const courses: CourseCardType[] = data.data.courses;
        setCoursesCache(prev => new Map(prev).set(progress, courses));
        return courses;
      } else {
        console.error('API error:', data);
        return [];
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  return (
    <CoursesContext.Provider value={{ coursesCache, fetchCoursesByProgress }}>
      {children}
    </CoursesContext.Provider>
  );
};
