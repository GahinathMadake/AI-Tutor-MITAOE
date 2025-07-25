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
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/student/test/history-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setTestHistoryDashboardData(data.data.dashboard);
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
      const res = await fetch(`${API_BASE}/student/test/history-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setTestHistory(data.data.testHistory);
      }
    } catch (error) {
      console.error("Failed to fetch test history", error);
    } finally {
      setIsTestHistoryLoading(false);
    }
  };

  async function refreshData(){
    console.log("Function Called");
    await fetchTestHistoryDashboardData();
    await fetchTestHistory();
    console.log("Function Executed");
  };

  useEffect(() => {
    if(!token){
      console.log("token Not exist");
      return;
    }

    fetchTestHistory();
    fetchTestHistoryDashboardData();
  }, [token]);

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
