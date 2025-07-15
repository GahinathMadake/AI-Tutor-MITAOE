import { useContext } from 'react';
import { CourseContext } from '@/context/CourseContext';
import type { CourseContextType } from '@/types/course';

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};