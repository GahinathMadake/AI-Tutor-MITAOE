import { config } from './config';
import { AppError } from '../errors/ApiError';

export interface DatabaseCourse {
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

export interface DatabaseChapter {
  chapter_id: string;
  name: string;
  course_id: string;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseTopic {
  topic_id: string;
  name: string;
  chapter_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  teacher_id: string;
  school_id: string;
  semester_id: string;
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  enrollment_key?: string;
}

export class CourseDatabaseService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.WORQHAT_API_KEY;
    this.baseUrl = 'https://api.worqhat.com/api/db';
  }

  private async executeQuery(query: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/run-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new AppError(`Database query failed: ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Database connection failed', 500);
    }
  }

  private generateEnrollmentKey(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private sanitizeString(str: string): string {
    return str.replace(/'/g, "''");
  }

  // Course Methods
  async createCourse(courseData: CreateCourseData): Promise<DatabaseCourse> {
    const courseId = `course_${this.generateUUID()}`;
    const enrollmentKey = this.generateEnrollmentKey();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO courses (course_id, name, description, enrollment_key, teacher_id, school_id, semester_id, created_at) 
      VALUES (
        '${courseId}',
        '${this.sanitizeString(courseData.name)}',
        '${courseData.description ? this.sanitizeString(courseData.description) : ''}',
        '${enrollmentKey}',
        '${courseData.teacher_id}',
        '${courseData.school_id}',
        '${courseData.semester_id}',
        '${now}'
      )
    `;

    try {
      await this.executeQuery(query);
      
      return {
        course_id: courseId,
        name: courseData.name,
        description: courseData.description,
        enrollment_key: enrollmentKey,
        teacher_id: courseData.teacher_id,
        school_id: courseData.school_id,
        semester_id: courseData.semester_id,
        created_at: now
      };
    } catch (error) {
      throw new AppError('Failed to create course', 500);
    }
  }

  async getCourseById(courseId: string): Promise<DatabaseCourse | null> {
    const query = `SELECT * FROM courses WHERE course_id = '${courseId}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const course = result.data[0];
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
      }
      
      return null;
    } catch (error) {
      throw new AppError('Failed to fetch course', 500);
    }
  }

  async getCoursesByTeacher(teacherId: string): Promise<DatabaseCourse[]> {
    const query = `SELECT * FROM courses WHERE teacher_id = '${teacherId}' ORDER BY created_at DESC`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        return result.data.map((course: any) => ({
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
      }
      
      return [];
    } catch (error) {
      throw new AppError('Failed to fetch courses', 500);
    }
  }

  async getCourseByEnrollmentKey(enrollmentKey: string): Promise<DatabaseCourse | null> {
    const query = `SELECT * FROM courses WHERE enrollment_key = '${enrollmentKey}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const course = result.data[0];
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
      }
      
      return null;
    } catch (error) {
      throw new AppError('Failed to fetch course by enrollment key', 500);
    }
  }

  async updateCourse(courseId: string, updates: UpdateCourseData): Promise<DatabaseCourse | null> {
    const now = new Date().toISOString();
    
    const setClause = Object.entries(updates)
      .filter(([key, value]) => value !== undefined && key !== 'course_id' && key !== 'created_at')
      .map(([key, value]) => `${key} = '${this.sanitizeString(String(value))}'`)
      .join(', ');

    if (!setClause) {
      throw new AppError('No valid fields to update', 400);
    }

    const query = `
      UPDATE courses 
      SET ${setClause}, updated_at = '${now}'
      WHERE course_id = '${courseId}'
    `;

    try {
      await this.executeQuery(query);
      return await this.getCourseById(courseId);
    } catch (error) {
      throw new AppError('Failed to update course', 500);
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    const query = `DELETE FROM courses WHERE course_id = '${courseId}'`;
    
    try {
      await this.executeQuery(query);
      return true;
    } catch (error) {
      throw new AppError('Failed to delete course', 500);
    }
  }

  // Chapter Methods
  async createChapter(courseId: string, chapterName: string): Promise<DatabaseChapter> {
    const chapterId = this.generateUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO chapters (chapter_id, name, course_id, created_at) 
      VALUES (
        '${chapterId}',
        '${this.sanitizeString(chapterName)}',
        '${courseId}',
        '${now}'
      )
    `;

    try {
      await this.executeQuery(query);
      
      return {
        chapter_id: chapterId,
        name: chapterName,
        course_id: courseId,
        created_at: now
      };
    } catch (error) {
      throw new AppError('Failed to create chapter', 500);
    }
  }

  async getChaptersByCourse(courseId: string): Promise<DatabaseChapter[]> {
    const query = `SELECT * FROM chapters WHERE course_id = '${courseId}' ORDER BY created_at ASC`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        return result.data.map((chapter: any) => ({
          chapter_id: chapter.chapter_id,
          name: chapter.name,
          course_id: chapter.course_id,
          created_at: chapter.created_at,
          updated_at: chapter.updated_at
        }));
      }
      
      return [];
    } catch (error) {
      throw new AppError('Failed to fetch chapters', 500);
    }
  }

  async getChapterById(chapterId: string): Promise<DatabaseChapter | null> {
    const query = `SELECT * FROM chapters WHERE chapter_id = '${chapterId}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const chapter = result.data[0];
        return {
          chapter_id: chapter.chapter_id,
          name: chapter.name,
          course_id: chapter.course_id,
          created_at: chapter.created_at,
          updated_at: chapter.updated_at
        };
      }
      
      return null;
    } catch (error) {
      throw new AppError('Failed to fetch chapter', 500);
    }
  }

  async updateChapter(chapterId: string, name: string): Promise<DatabaseChapter | null> {
    const now = new Date().toISOString();
    
    const query = `
      UPDATE chapters 
      SET name = '${this.sanitizeString(name)}', updated_at = '${now}'
      WHERE chapter_id = '${chapterId}'
    `;

    try {
      await this.executeQuery(query);
      return await this.getChapterById(chapterId);
    } catch (error) {
      throw new AppError('Failed to update chapter', 500);
    }
  }

  async deleteChapter(chapterId: string): Promise<boolean> {
    const query = `DELETE FROM chapters WHERE chapter_id = '${chapterId}'`;
    
    try {
      await this.executeQuery(query);
      return true;
    } catch (error) {
      throw new AppError('Failed to delete chapter', 500);
    }
  }

  // Topic Methods
  async createTopic(chapterId: string, topicName: string): Promise<DatabaseTopic> {
    const topicId = this.generateUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO topics (topic_id, name, chapter_id, created_at) 
      VALUES (
        '${topicId}',
        '${this.sanitizeString(topicName)}',
        '${chapterId}',
        '${now}'
      )
    `;

    try {
      await this.executeQuery(query);
      
      return {
        topic_id: topicId,
        name: topicName,
        chapter_id: chapterId,
        created_at: now
      };
    } catch (error) {
      throw new AppError('Failed to create topic', 500);
    }
  }

  async getTopicsByChapter(chapterId: string): Promise<DatabaseTopic[]> {
    const query = `SELECT * FROM topics WHERE chapter_id = '${chapterId}' ORDER BY created_at ASC`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        return result.data.map((topic: any) => ({
          topic_id: topic.topic_id,
          name: topic.name,
          chapter_id: topic.chapter_id,
          created_at: topic.created_at,
          updated_at: topic.updated_at
        }));
      }
      
      return [];
    } catch (error) {
      throw new AppError('Failed to fetch topics', 500);
    }
  }

  async getTopicById(topicId: string): Promise<DatabaseTopic | null> {
    const query = `SELECT * FROM topics WHERE topic_id = '${topicId}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const topic = result.data[0];
        return {
          topic_id: topic.topic_id,
          name: topic.name,
          chapter_id: topic.chapter_id,
          created_at: topic.created_at,
          updated_at: topic.updated_at
        };
      }
      
      return null;
    } catch (error) {
      throw new AppError('Failed to fetch topic', 500);
    }
  }

  async updateTopic(topicId: string, name: string): Promise<DatabaseTopic | null> {
    const now = new Date().toISOString();
    
    const query = `
      UPDATE topics 
      SET name = '${this.sanitizeString(name)}', updated_at = '${now}'
      WHERE topic_id = '${topicId}'
    `;

    try {
      await this.executeQuery(query);
      return await this.getTopicById(topicId);
    } catch (error) {
      throw new AppError('Failed to update topic', 500);
    }
  }

  async deleteTopic(topicId: string): Promise<boolean> {
    const query = `DELETE FROM topics WHERE topic_id = '${topicId}'`;
    
    try {
      await this.executeQuery(query);
      return true;
    } catch (error) {
      throw new AppError('Failed to delete topic', 500);
    }
  }

  // Utility Methods
  async getCourseStructure(courseId: string): Promise<{
    course: DatabaseCourse | null;
    chapters: Array<{
      chapter: DatabaseChapter;
      topics: DatabaseTopic[];
    }>;
  }> {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        return { course: null, chapters: [] };
      }

      const chapters = await this.getChaptersByCourse(courseId);
      const courseStructure: Array<{ chapter: DatabaseChapter; topics: DatabaseTopic[] }> = [];

      for (const chapter of chapters) {
        const topics = await this.getTopicsByChapter(chapter.chapter_id);
        courseStructure.push({
          chapter,
          topics
        });
      }

      return {
        course,
        chapters: courseStructure
      };
    } catch (error) {
      throw new AppError('Failed to fetch course structure', 500);
    }
  }
}

export const coursedbService = new CourseDatabaseService();