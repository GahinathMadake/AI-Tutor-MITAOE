export interface CourseFilters {
  school_id?: string;
  semester_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CourseStats {
  total_courses: number;
  total_chapters: number;
  total_topics: number;
  created_this_month: number;
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface CourseHierarchy {
  course_id: string;
  name: string;
  description?: string;
  enrollment_key: string;
  teacher_id: string;
  school_id: string;
  semester_id: string;
  created_at: string;
  updated_at?: string;
  chapters: ChapterHierarchy[];
}

export interface ChapterHierarchy {
  chapter_id: string;
  name: string;
  course_id: string;
  created_at: string;
  updated_at?: string;
  topics: TopicHierarchy[];
}

export interface TopicHierarchy {
  topic_id: string;
  name: string;
  chapter_id: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
