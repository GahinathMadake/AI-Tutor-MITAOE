// Static data interfaces
export interface DashboardData {
  testCompleted: number;
  questionsSolved: number;
  ongoingCourses: number;
  completedCourses: number;
}

export interface OngoingCourse {
  id: string;
  name: string;
  progress: number;
  schoolID: string;
  instructor: string;
  totalTests: number;
  completedTests: number;
}

export interface TimelineEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  subject: string;
  duration: number;
  totalMarks: number;
}

export type StudentDashboardContextType = {
  dashboardData: DashboardData | null;
  ongoingCourses: OngoingCourse[];
  timelineEvents: TimelineEvent[];
  loading: boolean;
  loadingTimeline: boolean;
  timelineStatus: string;
  setTimelineStatus: (status: string) => void;
  fetchDashboardData: () => void;
  fetchTimelineEvents: () => void;
};