/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { ApiResponse } from '../types/auth';
import { API_BASE } from '../utils/api';
import type {
  Test,
  TestResult,
  TestState,
  TestContextType,
  CreateTestData,
  UpdateTestData,
  TestFilters
} from '../types/test';

export const TestContext = createContext<TestContextType | undefined>(undefined);

interface TestProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('TestProvider must be used within an AuthProvider');
  }

  const { user, token, isAuthenticated } = authContext;

  const [testState, setTestState] = useState<TestState>({
    tests: [],
    currentTest: null,
    testResults: [],
    currentTestResults: [],
    filteredTests: [],
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

  // Test CRUD Methods
  const createTest = async (testData: CreateTestData) => {
    if (!user || user.role !== 'TEACHER') {
      throw new Error('Only teachers can create tests');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}`, {
        method: 'POST',
        body: JSON.stringify(testData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          tests: [...prev.tests, data.data],
          success: 'Test created successfully',
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to create test',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTests = async (filters?: TestFilters) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const queryString = queryParams.toString();
      const endpoint = `/tests/${user.id}${queryString ? `?${queryString}` : ''}`;
      
      const response = await makeAuthenticatedRequest(endpoint);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          tests: data.data,
          filteredTests: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch tests',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTestById = async (testId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/${testId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          currentTest: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch test',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const updateTest = async (testId: string, updateData: UpdateTestData) => {
    if (!user || user.role !== 'TEACHER') {
      throw new Error('Only teachers can update tests');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/${testId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          currentTest: data.data,
          tests: prev.tests.map(test => 
            test.test_id === testId ? data.data : test
          ),
          filteredTests: prev.filteredTests.map(test => 
            test.test_id === testId ? data.data : test
          ),
          success: 'Test updated successfully',
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to update test',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const deleteTest = async (testId: string) => {
    if (!user || user.role !== 'TEACHER') {
      throw new Error('Only teachers can delete tests');
    }
    
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return;
    }

    setTestState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/${testId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          tests: prev.tests.filter(test => test.test_id !== testId),
          filteredTests: prev.filteredTests.filter(test => test.test_id !== testId),
          currentTest: prev.currentTest?.test_id === testId ? null : prev.currentTest,
          success: 'Test deleted successfully',
          isLoading: false
        }));
        
        // Navigate back to tests list
        navigate('/tests');
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to delete test',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Test Results Methods
  const getTestResults = async (testId: string) => {
    if (!user || user.role !== 'TEACHER') {
      throw new Error('Only teachers can view test results');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/${testId}/results`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          currentTestResults: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch test results',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Filter Methods
  const getTestsByTeacher = async (teacherId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/teacher/${teacherId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          filteredTests: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch tests by teacher',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTestsByCourse = async (courseId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/course/${courseId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          filteredTests: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch tests by course',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const getTestsByTopic = async (topicId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setTestState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await makeAuthenticatedRequest(`/tests/${user.id}/topic/${topicId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTestState(prev => ({
          ...prev,
          filteredTests: data.data,
          isLoading: false
        }));
      } else {
        setTestState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch tests by topic',
          isLoading: false
        }));
      }
    } catch (err) {
      setTestState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  // Utility Methods
  const setError = (error: string) => {
    setTestState(prev => ({ ...prev, error }));
  };

  const setSuccess = (success: string) => {
    setTestState(prev => ({ ...prev, success }));
  };

  const clearMessages = () => {
    setTestState(prev => ({ ...prev, error: '', success: '' }));
  };

  const setCurrentTest = (test: Test | null) => {
    setTestState(prev => ({ ...prev, currentTest: test }));
  };

  const setCurrentTestResults = (results: TestResult[]) => {
    setTestState(prev => ({ ...prev, currentTestResults: results }));
  };

  const applyFilters = (filters: TestFilters) => {
    let filtered = [...testState.tests];

    if (filters.teacherId) {
      filtered = filtered.filter(test => test.teacherId === filters.teacherId);
    }

    if (filters.courseId) {
      filtered = filtered.filter(test => test.courseId === filters.courseId);
    }

    if (filters.topicId) {
      filtered = filtered.filter(test => test.topicId === filters.topicId);
    }

    if (filters.status) {
      const now = new Date();
      filtered = filtered.filter(test => {
        const startTime = new Date(test.startTime);
        const endTime = new Date(test.endTime);
        
        switch (filters.status) {
          case 'upcoming':
            return startTime > now;
          case 'ongoing':
            return startTime <= now && endTime >= now;
          case 'completed':
            return endTime < now;
          default:
            return true;
        }
      });
    }

    if (filters.limit) {
      const offset = filters.offset || 0;
      filtered = filtered.slice(offset, offset + filters.limit);
    }

    setTestState(prev => ({ ...prev, filteredTests: filtered }));
  };

  // Load tests when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getTests();
    }
  }, [isAuthenticated, user]);

  const value: TestContextType = {
    ...testState,
    // Test CRUD methods
    createTest,
    getTests,
    getTestById,
    updateTest,
    deleteTest,
    // Test results methods
    getTestResults,
    // Filter methods
    getTestsByTeacher,
    getTestsByCourse,
    getTestsByTopic,
    // Utility methods
    setError,
    setSuccess,
    clearMessages,
    setCurrentTest,
    setCurrentTestResults,
    applyFilters,
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};