import { CoursesContext } from "@/context/StudentCoursesContext";
import { useContext } from "react";

export const useCourseContext = () => {
  const context = useContext(CoursesContext);
  if (!context) throw new Error("useCourseContext must be used within CourseProvider");
  return context;
};