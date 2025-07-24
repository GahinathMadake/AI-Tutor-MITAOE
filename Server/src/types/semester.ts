export interface Semester {
  id: string;
  name: string;
  courses:CourseCard[],
}

export interface CourseCard {
  id: string;
  name: string;
  description: string;
  schoolName: string;
  teacherName: string;
  numberOfEnrollments: number;
}