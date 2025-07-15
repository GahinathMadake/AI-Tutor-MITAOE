// Types for Course Management
export interface Course {
  course_id: string;
  name: string;
  description: string;
  enrollment_key: string;
  school_id: string;
  semester_id: string;
  created_at: string;
  updated_at: string;
  teacher_id: string;
}

export interface Chapter {
  chapter_id: string;
  name: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  topic_id: string;
  name: string;
  chapter_id: string;
  created_at: string;
  updated_at: string;
}

export interface CourseStructure {
  course: Course;
  chapters: (Chapter & { topics: Topic[] })[];
}

export interface CreateCourseData {
  name: string;
  description: string;
  school_id: string;
  semester_id: string;
}

export interface UpdateCourseData {
  description?: string;
  enrollment_key?: string;
}

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  chapters: Chapter[];
  currentChapter: Chapter | null;
  topics: Topic[];
  currentTopic: Topic | null;
  courseStructure: CourseStructure | null;
  isLoading: boolean;
  error: string;
  success: string;
}

export interface CourseContextType extends CourseState {
  // Course methods
  createCourse: (courseData: CreateCourseData) => Promise<void>;
  getCourses: () => Promise<void>;
  getCourse: (courseId: string) => Promise<void>;
  updateCourse: (courseId: string, updateData: UpdateCourseData) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  getCourseByEnrollmentKey: (enrollmentKey: string) => Promise<void>;
  getCourseStructure: (courseId: string) => Promise<void>;
  
  // Chapter methods
  createChapter: (courseId: string, name: string) => Promise<void>;
  getChapters: (courseId: string) => Promise<void>;
  getChapter: (chapterId: string) => Promise<void>;
  updateChapter: (chapterId: string, name: string) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
  
  // Topic methods
  createTopic: (chapterId: string, name: string) => Promise<void>;
  getTopics: (chapterId: string) => Promise<void>;
  getTopic: (topicId: string) => Promise<void>;
  updateTopic: (topicId: string, name: string) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  
  // Utility methods
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  clearMessages: () => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setCurrentTopic: (topic: Topic | null) => void;
}