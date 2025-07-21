import { TakeTestContext } from "@/context/StudentTakeTestContext";
import { useContext } from "react";

export const useStudentTestContext = () => {
  const context = useContext(TakeTestContext);
  if (!context) {
    throw new Error('useTestContext must be used within TestProvider');
  }
  return context;
};