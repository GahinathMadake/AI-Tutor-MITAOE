export const SemesterTabs = {
  AllSemesters: "all-semesters",
  AllUsers: "all-users",
  AllCourses: "all-courses",
} as const;

export type SemesterTab = typeof SemesterTabs[keyof typeof SemesterTabs];
