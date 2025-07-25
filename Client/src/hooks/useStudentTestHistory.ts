import { TestHistoryContext } from "@/context/studentTestHistoryContext";
import { useContext } from "react";

export const useTestHistory = () => {
  const context = useContext(TestHistoryContext);
  if (!context) {
    throw new Error("useTestHistory must be used within a TestHistoryProvider");
  }
  return context;
};