import { CourseEnrollContext } from "@/context/StudentCourseEnrollContext";
import type { CourseEnrollContextType } from "@/types/StudentSiteHome";
import { useContext } from "react";

export const useCourseEnrollContext = ():CourseEnrollContextType => {
  const ctx = useContext(CourseEnrollContext);
  if (!ctx) throw new Error('useCourseEnrollContext must be used inside CourseEnrollProvider');
  return ctx;
};