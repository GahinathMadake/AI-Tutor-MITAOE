import { SingleCourseContext } from "@/context/StudentSingleCourseContext";
import { useContext } from "react";

export const useSingleCourseContext = () => {
  const context = useContext(SingleCourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider');
  }
  return context;
};