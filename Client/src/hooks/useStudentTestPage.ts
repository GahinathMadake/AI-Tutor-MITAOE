import { TestPageContext } from "@/context/StudentTestPageContext";
import { useContext } from "react";

export const useStudentTestPage = () => {
  const context = useContext(TestPageContext);
  if (!context) {
    throw new Error("useStudentTestPage must be used within a TestHistoryProvider");
  }
  return context;
};