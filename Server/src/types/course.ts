export interface CourseCard {
  id: string;
  name: string;
  description: string;
  schoolName: string;
  teacherName: string;
  numberOfEnrollments: number;
  totalTests: number;
  completedTests: number;
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
  teacherName: string;
  schoolName: string;
  chapters: ChapterType[];
  TotalTests:number;
}
