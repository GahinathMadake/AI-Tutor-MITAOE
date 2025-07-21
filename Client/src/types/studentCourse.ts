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

export interface EnrollmentType {
  id: string;
  courseId: string;
  userId: string;
  completedTestIds: string[];
  enrolledAt: string;
}


export interface TestType {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface TopicType {
  id: string;
  name: string;
  tests: TestType[];
}

export interface ChapterType {
  id: string;
  name: string;
  topics: TopicType[];
}



export interface SingleCourseType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  teacher: {
    id: string;
    name: string;
    email?: string;
  };
  school: {
    id: string;
    name: string;
  };
  chapters: ChapterType[];
  TotalTests:number;
}
