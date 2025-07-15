import { coursedbService, DatabaseCourse, DatabaseChapter, DatabaseTopic, CreateCourseData, UpdateCourseData } from '../config/courseDatabase';

export interface CreateCourseRequest {
  name: string;
  description?: string;
  school_id: string;
  semester_id: string;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  enrollment_key?: string;
}

export interface CourseResponse {
  course_id: string;
  name: string;
  description?: string;
  enrollment_key: string;
  teacher_id: string;
  school_id: string;
  semester_id: string;
  created_at: string;
  updated_at?: string;
}

export interface ChapterResponse {
  chapter_id: string;
  name: string;
  course_id: string;
  created_at: string;
  updated_at?: string;
}

export interface TopicResponse {
  topic_id: string;
  name: string;
  chapter_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CourseStructureResponse {
  course: CourseResponse;
  chapters: Array<{
    chapter: ChapterResponse;
    topics: TopicResponse[];
  }>;
}

export class CourseService {
  
  // Course Methods
  async createCourse(teacherId: string, courseData: CreateCourseRequest): Promise<CourseResponse> {
    try {
      const createData: CreateCourseData = {
        name: courseData.name,
        description: courseData.description,
        teacher_id: teacherId,
        school_id: courseData.school_id,
        semester_id: courseData.semester_id
      };

      const course = await coursedbService.createCourse(createData);
      
      return {
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        enrollment_key: course.enrollment_key,
        teacher_id: course.teacher_id,
        school_id: course.school_id,
        semester_id: course.semester_id,
        created_at: course.created_at,
        updated_at: course.updated_at
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  }

  async getCourseById(courseId: string): Promise<CourseResponse | null> {
    try {
      const course = await coursedbService.getCourseById(courseId);
      
      if (!course) {
        return null;
      }

      return {
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        enrollment_key: course.enrollment_key,
        teacher_id: course.teacher_id,
        school_id: course.school_id,
        semester_id: course.semester_id,
        created_at: course.created_at,
        updated_at: course.updated_at
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw new Error('Failed to fetch course');
    }
  }

  async getCoursesByTeacher(teacherId: string): Promise<CourseResponse[]> {
    try {
      const courses = await coursedbService.getCoursesByTeacher(teacherId);
      
      return courses.map(course => ({
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        enrollment_key: course.enrollment_key,
        teacher_id: course.teacher_id,
        school_id: course.school_id,
        semester_id: course.semester_id,
        created_at: course.created_at,
        updated_at: course.updated_at
      }));
    } catch (error) {
      console.error('Error fetching courses by teacher:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  async getCourseByEnrollmentKey(enrollmentKey: string): Promise<CourseResponse | null> {
    try {
      const course = await coursedbService.getCourseByEnrollmentKey(enrollmentKey);
      
      if (!course) {
        return null;
      }

      return {
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        enrollment_key: course.enrollment_key,
        teacher_id: course.teacher_id,
        school_id: course.school_id,
        semester_id: course.semester_id,
        created_at: course.created_at,
        updated_at: course.updated_at
      };
    } catch (error) {
      console.error('Error fetching course by enrollment key:', error);
      throw new Error('Failed to fetch course');
    }
  }

  async updateCourse(courseId: string, updateData: UpdateCourseRequest): Promise<CourseResponse | null> {
    try {
      const updates: UpdateCourseData = {
        // course_name: updateData.name,
        description: updateData.description,
        enrollment_key: updateData.enrollment_key
      };

      const course = await coursedbService.updateCourse(courseId, updates);
      
      if (!course) {
        return null;
      }

      return {
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        enrollment_key: course.enrollment_key,
        teacher_id: course.teacher_id,
        school_id: course.school_id,
        semester_id: course.semester_id,
        created_at: course.created_at,
        updated_at: course.updated_at
      };
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      return await coursedbService.deleteCourse(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  }

  // Chapter Methods
  async createChapter(courseId: string, chapterName: string): Promise<ChapterResponse> {
    try {
      const chapter = await coursedbService.createChapter(courseId, chapterName);
      
      return {
        chapter_id: chapter.chapter_id,
        name: chapter.name,
        course_id: chapter.course_id,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
      };
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw new Error('Failed to create chapter');
    }
  }

  async getChaptersByCourse(courseId: string): Promise<ChapterResponse[]> {
    try {
      const chapters = await coursedbService.getChaptersByCourse(courseId);
      
      return chapters.map(chapter => ({
        chapter_id: chapter.chapter_id,
        name: chapter.name,
        course_id: chapter.course_id,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
      }));
    } catch (error) {
      console.error('Error fetching chapters by course:', error);
      throw new Error('Failed to fetch chapters');
    }
  }

  async getChapterById(chapterId: string): Promise<ChapterResponse | null> {
    try {
      const chapter = await coursedbService.getChapterById(chapterId);
      
      if (!chapter) {
        return null;
      }

      return {
        chapter_id: chapter.chapter_id,
        name: chapter.name,
        course_id: chapter.course_id,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
      };
    } catch (error) {
      console.error('Error fetching chapter by ID:', error);
      throw new Error('Failed to fetch chapter');
    }
  }

  async updateChapter(chapterId: string, name: string): Promise<ChapterResponse | null> {
    try {
      const chapter = await coursedbService.updateChapter(chapterId, name);
      
      if (!chapter) {
        return null;
      }

      return {
        chapter_id: chapter.chapter_id,
        name: chapter.name,
        course_id: chapter.course_id,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
      };
    } catch (error) {
      console.error('Error updating chapter:', error);
      throw new Error('Failed to update chapter');
    }
  }

  async deleteChapter(chapterId: string): Promise<boolean> {
    try {
      return await coursedbService.deleteChapter(chapterId);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      throw new Error('Failed to delete chapter');
    }
  }

  // Topic Methods
  async createTopic(chapterId: string, topicName: string): Promise<TopicResponse> {
    try {
      const topic = await coursedbService.createTopic(chapterId, topicName);
      
      return {
        topic_id: topic.topic_id,
        name: topic.name,
        chapter_id: topic.chapter_id,
        created_at: topic.created_at,
        updated_at: topic.updated_at
      };
    } catch (error) {
      console.error('Error creating topic:', error);
      throw new Error('Failed to create topic');
    }
  }

  async getTopicsByChapter(chapterId: string): Promise<TopicResponse[]> {
    try {
      const topics = await coursedbService.getTopicsByChapter(chapterId);
      
      return topics.map(topic => ({
        topic_id: topic.topic_id,
        name: topic.name,
        chapter_id: topic.chapter_id,
        created_at: topic.created_at,
        updated_at: topic.updated_at
      }));
    } catch (error) {
      console.error('Error fetching topics by chapter:', error);
      throw new Error('Failed to fetch topics');
    }
  }

  async getTopicById(topicId: string): Promise<TopicResponse | null> {
    try {
      const topic = await coursedbService.getTopicById(topicId);
      
      if (!topic) {
        return null;
      }

      return {
        topic_id: topic.topic_id,
        name: topic.name,
        chapter_id: topic.chapter_id,
        created_at: topic.created_at,
        updated_at: topic.updated_at
      };
    } catch (error) {
      console.error('Error fetching topic by ID:', error);
      throw new Error('Failed to fetch topic');
    }
  }

  async updateTopic(topicId: string, name: string): Promise<TopicResponse | null> {
    try {
      const topic = await coursedbService.updateTopic(topicId, name);
      
      if (!topic) {
        return null;
      }

      return {
        topic_id: topic.topic_id,
        name: topic.name,
        chapter_id: topic.chapter_id,
        created_at: topic.created_at,
        updated_at: topic.updated_at
      };
    } catch (error) {
      console.error('Error updating topic:', error);
      throw new Error('Failed to update topic');
    }
  }

  async deleteTopic(topicId: string): Promise<boolean> {
    try {
      return await coursedbService.deleteTopic(topicId);
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw new Error('Failed to delete topic');
    }
  }

  // Utility Methods
  async getCourseStructure(courseId: string): Promise<CourseStructureResponse | null> {
    try {
      const structure = await coursedbService.getCourseStructure(courseId);
      
      if (!structure.course) {
        return null;
      }

      return {
        course: {
          course_id: structure.course.course_id,
          name: structure.course.name,
          description: structure.course.description,
          enrollment_key: structure.course.enrollment_key,
          teacher_id: structure.course.teacher_id,
          school_id: structure.course.school_id,
          semester_id: structure.course.semester_id,
          created_at: structure.course.created_at,
          updated_at: structure.course.updated_at
        },
        chapters: structure.chapters.map(chapterData => ({
          chapter: {
            chapter_id: chapterData.chapter.chapter_id,
            name: chapterData.chapter.name,
            course_id: chapterData.chapter.course_id,
            created_at: chapterData.chapter.created_at,
            updated_at: chapterData.chapter.updated_at
          },
          topics: chapterData.topics.map(topic => ({
            topic_id: topic.topic_id,
            name: topic.name,
            chapter_id: topic.chapter_id,
            created_at: topic.created_at,
            updated_at: topic.updated_at
          }))
        }))
      };
    } catch (error) {
      console.error('Error fetching course structure:', error);
      throw new Error('Failed to fetch course structure');
    }
  }

  // Validation Methods
  async validateCourseAccess(courseId: string, teacherId: string): Promise<boolean> {
    try {
      const course = await this.getCourseById(courseId);
      return course !== null && course.teacher_id === teacherId;
    } catch (error) {
      console.error('Error validating course access:', error);
      return false;
    }
  }

  async validateChapterAccess(chapterId: string, teacherId: string): Promise<boolean> {
    try {
      const chapter = await this.getChapterById(chapterId);
      if (!chapter) return false;
      
      return await this.validateCourseAccess(chapter.course_id, teacherId);
    } catch (error) {
      console.error('Error validating chapter access:', error);
      return false;
    }
  }

  async validateTopicAccess(topicId: string, teacherId: string): Promise<boolean> {
    try {
      const topic = await this.getTopicById(topicId);
      if (!topic) return false;
      
      return await this.validateChapterAccess(topic.chapter_id, teacherId);
    } catch (error) {
      console.error('Error validating topic access:', error);
      return false;
    }
  }
}

export const courseService = new CourseService();