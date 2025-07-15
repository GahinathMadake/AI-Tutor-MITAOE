/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { ApiResponse } from '../types/auth';
import { API_BASE } from '../utils/api';
import type {
  Course,
  Chapter,
  Topic,
  CourseState,
  CourseContextType,
  CreateCourseData,
  UpdateCourseData
} from '../types/course';

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('CourseProvider must be used within an AuthProvider');
  }

  const { user, token, isAuthenticated } = authContext;

  const [courseState, setCourseState] = useState<CourseState>({
    courses: [],
    currentCourse: null,
    chapters: [],
    currentChapter: null,
    topics: [],
    currentTopic: null,
    courseStructure: null,
    isLoading: false,
    error: '',
    success: ''
  });

  // Helper function to make authenticated API calls
  const makeAuthenticatedRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    if (!token || !user) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      authContext.logout();
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      throw new Error('Access denied. You don\'t have permission to perform this action.');
    }

    return response;
  };

  // Course Methods
  const createCourse = async (courseData: CreateCourseData) => {
      if (!user || user.role !== 'TEACHER') {
        throw new Error('Only teachers can create courses');
    }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}`, {
        method: 'POST',
        body: JSON.stringify(courseData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          courses: [...prev.courses, data.data],
          success: 'Course created successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to create course',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getCourses = async () => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          courses: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch courses',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getCourse = async (courseId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentCourse: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch course',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const updateCourse = async (courseId: string, updateData: UpdateCourseData) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentCourse: data.data,
          courses: prev.courses.map(course => 
            course.course_id === courseId ? data.data : course
          ),
          success: 'Course updated successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to update course',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const deleteCourse = async (courseId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          courses: prev.courses.filter(course => course.course_id !== courseId),
          currentCourse: prev.currentCourse?.course_id === courseId ? null : prev.currentCourse,
          success: 'Course deleted successfully',
          isLoading: false
        }));
        
        // Navigate back to courses list
        navigate('/courses');
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to delete course',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getCourseByEnrollmentKey = async (enrollmentKey: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/enrollment/${enrollmentKey}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentCourse: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Course not found with this enrollment key',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getCourseStructure = async (courseId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}/structure`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          courseStructure: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch course structure',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Chapter Methods
  const createChapter = async (courseId: string, name: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}/chapters`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          chapters: [...prev.chapters, data.data],
          success: 'Chapter created successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to create chapter',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getChapters = async (courseId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/${courseId}/chapters`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          chapters: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch chapters',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getChapter = async (chapterId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/chapters/${chapterId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentChapter: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch chapter',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const updateChapter = async (chapterId: string, name: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/chapters/${chapterId}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentChapter: data.data,
          chapters: prev.chapters.map(chapter => 
            chapter.chapter_id === chapterId ? data.data : chapter
          ),
          success: 'Chapter updated successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to update chapter',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const deleteChapter = async (chapterId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    if (!confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      return;
    }

    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/chapters/${chapterId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          chapters: prev.chapters.filter(chapter => chapter.chapter_id !== chapterId),
          currentChapter: prev.currentChapter?.chapter_id === chapterId ? null : prev.currentChapter,
          success: 'Chapter deleted successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to delete chapter',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Topic Methods
  const createTopic = async (chapterId: string, name: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/chapters/${chapterId}/topics`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          topics: [...prev.topics, data.data],
          success: 'Topic created successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to create topic',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTopics = async (chapterId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/chapters/${chapterId}/topics`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          topics: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch topics',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTopic = async (topicId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/topics/${topicId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentTopic: data.data,
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch topic',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const updateTopic = async (topicId: string, name: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/topics/${topicId}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          currentTopic: data.data,
          topics: prev.topics.map(topic => 
            topic.topic_id === topicId ? data.data : topic
          ),
          success: 'Topic updated successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to update topic',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const deleteTopic = async (topicId: string) => {
      if (!user || user.role !== 'TEACHER') {
    throw new Error('Only teachers can create courses');
  }
    
    if (!confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      return;
    }

    setCourseState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/courses/${user.id}/topics/${topicId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCourseState(prev => ({
          ...prev,
          topics: prev.topics.filter(topic => topic.topic_id !== topicId),
          currentTopic: prev.currentTopic?.topic_id === topicId ? null : prev.currentTopic,
          success: 'Topic deleted successfully',
          isLoading: false
        }));
      } else {
        setCourseState(prev => ({
          ...prev,
          error: data.error || 'Failed to delete topic',
          isLoading: false
        }));
      }
    } catch (err) {
      setCourseState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Utility Methods
  const setError = (error: string) => {
    setCourseState(prev => ({ ...prev, error }));
  };

  const setSuccess = (success: string) => {
    setCourseState(prev => ({ ...prev, success }));
  };

  const clearMessages = () => {
    setCourseState(prev => ({ ...prev, error: '', success: '' }));
  };

  const setCurrentCourse = (course: Course | null) => {
    setCourseState(prev => ({ ...prev, currentCourse: course }));
  };

  const setCurrentChapter = (chapter: Chapter | null) => {
    setCourseState(prev => ({ ...prev, currentChapter: chapter }));
  };

  const setCurrentTopic = (topic: Topic | null) => {
    setCourseState(prev => ({ ...prev, currentTopic: topic }));
  };

  // Load courses when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getCourses();
    }
  }, [isAuthenticated, user]);

  const value: CourseContextType = {
    ...courseState,
    // Course methods
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    getCourseByEnrollmentKey,
    getCourseStructure,
    // Chapter methods
    createChapter,
    getChapters,
    getChapter,
    updateChapter,
    deleteChapter,
    // Topic methods
    createTopic,
    getTopics,
    getTopic,
    updateTopic,
    deleteTopic,
    // Utility methods
    setError,
    setSuccess,
    clearMessages,
    setCurrentCourse,
    setCurrentChapter,
    setCurrentTopic,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};