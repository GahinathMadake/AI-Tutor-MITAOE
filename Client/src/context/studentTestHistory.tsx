import React, { createContext, useState, useEffect } from "react";
import type { TestHistoryDashboardData, TestHistory} from "@/types/studentTestHistory";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/utils/api";

type TestHistoryContextType = {
  testHistoryDashboardData?: TestHistoryDashboardData;
  testHistory: TestHistory[];
  isLoading: boolean;
  isTestHistoryLoading: boolean;
  refreshData: () => void;
};

export const TestHistoryContext = createContext<TestHistoryContextType | undefined>(undefined);

export const StudentTestHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  const [testHistoryDashboardData, setTestHistoryDashboardData] = useState<TestHistoryDashboardData>();
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestHistoryLoading, setIsTestHistoryLoading] = useState(true);

  const fetchTestHistoryDashboardData = async () => {
    if (!user?.id || !token) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/student/test/history-dashboard/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setTestHistoryDashboardData(data.data.dashboard);
        localStorage.setItem("testDashboardData", JSON.stringify(data.data.dashboard));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    if (!user?.id || !token) return;

    setIsTestHistoryLoading(true);

    try {
      const res = await fetch(`${API_BASE}/student/test/history/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setTestHistory(data.data.testHistory);
        localStorage.setItem("testHistory", JSON.stringify(data.data.testHistory));
      }
    } catch (error) {
      console.error("Failed to fetch test history", error);
    } finally {
      setIsTestHistoryLoading(false);
    }
  };

  const refreshData = () => {
    fetchTestHistoryDashboardData();
    fetchTestHistory();
  };

  useEffect(() => {
    if (!user) return;

    const cachedDashboard = localStorage.getItem("testDashboardData");
    const cachedHistory = localStorage.getItem("testHistory");

    if (cachedDashboard) {
      setTestHistoryDashboardData(JSON.parse(cachedDashboard));
      setIsLoading(false);
    } else {
      fetchTestHistoryDashboardData();
    }

    if (cachedHistory) {
      setTestHistory(JSON.parse(cachedHistory));
      setIsTestHistoryLoading(false);
    } else {
      fetchTestHistory();
    }
  }, [user]);

  return (
    <TestHistoryContext.Provider
      value={{
        testHistoryDashboardData,
        testHistory,
        isLoading,
        isTestHistoryLoading,
        refreshData,
      }}
    >
      {children}
    </TestHistoryContext.Provider>
  );
};
