import { StudentSiteHomeContext } from "@/context/SiteHomeContext";
import type { studentSiteHomeContextType } from "@/types/StudentSiteHome";
import { useContext } from "react";

export const useStudentSiteHome = (): studentSiteHomeContextType => {
  const ctx = useContext(StudentSiteHomeContext);
  if (!ctx) throw new Error('useStudentSiteHome must be used inside StudentSiteHomeProvider');
  return ctx;
};