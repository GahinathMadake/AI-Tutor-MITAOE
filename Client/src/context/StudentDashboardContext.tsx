import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { DashboardData, OngoingCourse, StudentDashboardContextType, TimelineEvent } from '../types/studentDashboard';
import { API_BASE } from '../utils/api';
import { useAuth } from '@/hooks/useAuth';
import type { ApiResponse } from '@/types/auth';

export const StudentDashboardContext = createContext<StudentDashboardContextType | undefined>(undefined);

export const StudentDashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [ongoingCourses, setOngoingCourses] = useState<OngoingCourse[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTimeline, setLoadingTimeline] = useState<boolean>(false);
  const [timelineStatus, setTimelineStatus] = useState<string>('all');

  const { token } = useAuth();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/student/user/dashboard-data`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setDashboardData(data.data.DashboardData);
        setOngoingCourses(data.data.OngoingCourses);
      } else {
        console.error('API error (dashboard-data):', data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const fetchTimelineEvents = async () => {
    setLoadingTimeline(true);
    try {
      const response = await fetch(`${API_BASE}/student/user/time-line-events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setTimelineEvents(data.data.timelineEvents || []);
      } else {
        console.error('API error (timeline-events):', data);
      }
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setTimeout(() => setLoadingTimeline(false), 500);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTimelineEvents();
  }, [token]);

  return (
    <StudentDashboardContext.Provider
      value={{
        dashboardData,
        ongoingCourses,
        timelineEvents,
        loading,
        loadingTimeline,
        timelineStatus,
        setTimelineStatus,
        fetchDashboardData,
        fetchTimelineEvents,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
};


