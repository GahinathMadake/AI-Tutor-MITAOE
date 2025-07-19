export interface CourseCard {
  id: string;
  name: string;
  description: string;
  school: {
    name: string;
  };
  numberOfEnrollments: number;
  teacher: {
    name: string;
  };
}
