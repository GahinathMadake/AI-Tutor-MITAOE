import { StudentDashboardContext } from "@/context/StudentDashboardContext";
import type { StudentDashboardContextType } from "@/types/studentDashboard";
import { useContext } from "react";

export const useStudentDashboard = (): StudentDashboardContextType => {
  const context = useContext(StudentDashboardContext);
  if (!context) {
    throw new Error('useStudentDashboard must be used within a StudentDashboardProvider');
  }
  return context;
};