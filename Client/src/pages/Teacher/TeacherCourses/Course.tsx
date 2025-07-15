/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Plus,
  Edit3,
  PlayCircle,
  CheckCircle,
  Settings,
  Award,
  GraduationCap,
  FileText,
  Video,
  Download
} from 'lucide-react';

// shadcn/ui components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// // Import types and hook
// import type {
//   Course,
//   Chapter,
//   Topic
// } from '@/types/course';
import { useCourse } from '@/hooks/useCourse';

import DashboardLayout from '@/components/layout/DashboardLayout';

// Updated interfaces to match API response
interface ApiTopic {
  topic_id: string;
  name: string;
  chapter_id: string;
  created_at: string;
  updated_at: string;
}

interface ApiChapter {
  chapter_id: string;
  name: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

interface ApiChapterWithTopics {
  chapter: ApiChapter;
  topics: ApiTopic[];
}

interface ApiCourse {
  course_id: string;
  name: string;
  description: string;
  enrollment_key: string;
  teacher_id: string;
  school_id: string;
  semester_id: string;
  created_at: string;
  updated_at: string;
}

interface ApiCourseStructure {
  course: ApiCourse;
  chapters: ApiChapterWithTopics[];
}

interface TopicItemProps {
  topic: ApiTopic;
  topicIndex: number;
  chapter: ApiChapter;
  course: ApiCourse;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, topicIndex, chapter, course }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(Math.random() > 0.6);
  const navigate = useNavigate();
  
  const handleToggleComplete = (): void => {
    setIsCompleted(!isCompleted);
  };

  // console.log("TopicItem", topic, topicIndex, chapter);
  const handleTopicClick = () => {
    // Navigate to the tests page for this topic
   navigate(`/dashboard/${course.name}/${course.course_id}/${chapter.name}/${topic.name}/${topic.topic_id}/tests`);
  };
  return (
    <div className="group flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border hover:shadow-sm" onClick={handleTopicClick}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            isCompleted 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
              : 'bg-muted border-2 border-border text-muted-foreground hover:border-primary/50'
          }`}>
            {isCompleted ? <CheckCircle size={16} /> : topicIndex + 1}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className={`font-medium transition-colors duration-200 ${
            isCompleted ? 'text-green-600 dark:text-green-400 line-through' : 'text-foreground'
          }`}>
            {topic.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Video size={12} />
              <span>12 min</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <FileText size={12} />
              <span>3 resources</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleToggleComplete}
          className="h-8 w-8 p-0"
        >
          {isCompleted ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <PlayCircle size={16} className="text-blue-500" />
          )}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit3 size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download size={14} />
        </Button>
      </div>
    </div>
  );
};

interface ChapterItemProps {
  chapter: ApiChapterWithTopics;
  chapterIndex: number;
  course: ApiCourse;
}

const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, chapterIndex, course }) => {
  const completedTopics = chapter.topics.filter(() => Math.random() > 0.6).length;
  const progressPercentage = chapter.topics.length > 0 ? (completedTopics / chapter.topics.length) * 100 : 0;
  
  const navigate = useNavigate();

  const handleAddTopic = () => {
    navigate(`/dashboard/courses/${chapter.chapter.course_id}/${chapter.chapter.name}/${chapter.chapter.chapter_id}/topics/create`);
  };

  return (
    <AccordionItem value={chapter.chapter.chapter_id} className="border rounded-xl px-2 mb-4 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <AccordionTrigger className="hover:no-underline py-6 px-4">
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {chapterIndex + 1}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-foreground">{chapter.chapter.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {chapter.topics.length} topics • {completedTopics} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Progress</div>
                  <div className="text-sm font-medium">{Math.round(progressPercentage)}%</div>
                </div>
                <Progress value={progressPercentage} className="w-24 h-2" />
              </div>
            </div>
            <Badge 
              variant={progressPercentage === 100 ? "default" : "secondary"}
              className={progressPercentage === 100 ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {progressPercentage === 100 ? "Complete" : "In Progress"}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-4 pb-6">
        <div className="space-y-1">
          {chapter.topics.map((topic, topicIndex) => (
            <TopicItem 
              key={topic.topic_id} 
              topic={topic} 
              topicIndex={topicIndex}
              chapter={chapter.chapter}
              course={course}
            />
          ))}
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handleAddTopic}>
            <Plus size={14} className="mr-2" />
            Add Topic
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

interface CourseHeaderProps {
  course: ApiCourse;
  chapters: ApiChapterWithTopics[];
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, chapters }) => {
  const totalTopics = chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0);
  const completedTopics = Math.floor(totalTopics * 0.65); // Mock completion
  const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  const navigate = useNavigate();
  const handleAddChapter = () => {
    navigate(`/dashboard/courses/${course.name}/${course.course_id}/chapters/create`);
  };
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-border/50 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {course.name}
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                    {course.enrollment_key}
                  </span>
                </p>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex items-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{chapters.length}</div>
                  <div className="text-xs text-muted-foreground">Chapters</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FileText size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{totalTopics}</div>
                  <div className="text-xs text-muted-foreground">Topics</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">12</div>
                  <div className="text-xs text-muted-foreground">Weeks</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Users size={16} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">245</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span>Overall Progress</span>
                  <span className="text-primary">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                <Award size={16} className="text-amber-500" />
                <span className="text-sm font-medium">4.8/5 rating</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
              <Settings size={16} className="mr-2" />
              Manage Course
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground" onClick={handleAddChapter}>
              <Plus size={16} className="mr-2" />
              Add Chapter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton components
const CourseHeaderSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-border/50 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div>
                <Skeleton className="h-10 w-80 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            
            <Skeleton className="h-6 w-full max-w-3xl mb-2" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            
            <div className="flex items-center gap-8 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-8 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex-1 max-w-md">
                <div className="flex justify-between mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChapterItemSkeleton: React.FC = () => {
  return (
    <div className="border rounded-xl px-2 mb-4 bg-card shadow-sm">
      <div className="py-6 px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="w-24 h-2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseStructureSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <ChapterItemSkeleton key={i} />
      ))}
    </div>
  );
};

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courseStructure, isLoading, error, getCourseStructure } = useCourse();
  const navigate = useNavigate();
  // Cast the courseStructure to match our API structure
  const apiCourseStructure = courseStructure as ApiCourseStructure | null;

  useEffect(() => {
    if (courseId) {
      getCourseStructure(courseId);
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <DashboardLayout 
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/dashboard/courses" },
          { label: "Loading...", isCurrentPage: true }
        ]}    
      >
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <CourseHeaderSkeleton />
            
            <div className="mt-8">
              <Tabs defaultValue="structure" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="structure" className="rounded-lg">Course Structure</TabsTrigger>
                  <TabsTrigger value="progress" className="rounded-lg">Progress</TabsTrigger>
                  <TabsTrigger value="resources" className="rounded-lg">Resources</TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="structure" className="mt-6">
                  <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-40" />
                      </CardTitle>
                      <CardDescription>
                        <Skeleton className="h-4 w-full max-w-lg" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <CourseStructureSkeleton />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="progress" className="mt-6">
                  <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                      </CardTitle>
                      <CardDescription>
                        <Skeleton className="h-4 w-64" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <Skeleton className="w-12 h-12 mx-auto mb-4" />
                        <Skeleton className="h-6 w-32 mx-auto mb-2" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-6">
                  <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-36" />
                      </CardTitle>
                      <CardDescription>
                        <Skeleton className="h-4 w-72" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <Skeleton className="w-12 h-12 mx-auto mb-4" />
                        <Skeleton className="h-6 w-36 mx-auto mb-2" />
                        <Skeleton className="h-4 w-56 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                      </CardTitle>
                      <CardDescription>
                        <Skeleton className="h-4 w-80" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <Skeleton className="w-12 h-12 mx-auto mb-4" />
                        <Skeleton className="h-6 w-32 mx-auto mb-2" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout 
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/dashboard/courses" },
          { label: "Error", isCurrentPage: true }
        ]}    
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Course</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button 
              onClick={() => courseId && getCourseStructure(courseId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!apiCourseStructure) {
    return (
      <DashboardLayout 
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/dashboard/courses" },
          { label: "Not Found", isCurrentPage: true }
        ]}    
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddChapter = () => {
      navigate(`/dashboard/courses/${apiCourseStructure.course.name}/${courseId}/chapters/create`);
  };

  return (
    <DashboardLayout 
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Courses", href: "/dashboard/courses" },
        { label: apiCourseStructure.course.name, isCurrentPage: true }
      ]}    
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <CourseHeader course={apiCourseStructure.course} chapters={apiCourseStructure.chapters} />
          
          <div className="mt-8">
            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="structure" className="rounded-lg">Course Structure</TabsTrigger>
                <TabsTrigger value="progress" className="rounded-lg">Progress</TabsTrigger>
                <TabsTrigger value="resources" className="rounded-lg">Resources</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="structure" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen size={20} className="text-white" />
                      </div>
                      Course Structure
                    </CardTitle>
                    <CardDescription className="text-base">
                      Expand chapters to view topics and track your progress through the course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    {apiCourseStructure.chapters.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {apiCourseStructure.chapters.map((chapter, chapterIndex) => (
                          <ChapterItem 
                            key={chapter.chapter.chapter_id} 
                            chapter={chapter} 
                            chapterIndex={chapterIndex}
                            course={apiCourseStructure.course}
                          />
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Chapters Yet</h3>
                        <p className="text-muted-foreground mb-6">Start building your course by adding the first chapter.</p>
                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600" onClick={handleAddChapter}>
                          <Plus size={16} className="mr-2" />
                          Add First Chapter
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      Progress
                    </CardTitle>
                    <CardDescription className="text-base">
                      Track your completion and learning metrics here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16 bg-muted/30 rounded-xl">
                      <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground">Progress tracking features are under development.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      Resources
                    </CardTitle>
                    <CardDescription className="text-base">
                      View all downloadable and linked resources here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16 bg-muted/30 rounded-xl">
                      <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Resources Yet</h3>
                      <p className="text-muted-foreground">Resources will appear here once added to topics.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                        <Settings size={20} className="text-white" />
                      </div>
                      Settings
                    </CardTitle>
                    <CardDescription className="text-base">
                      Manage course visibility, access, and more.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16 bg-muted/30 rounded-xl">
                      <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
                      <p className="text-muted-foreground">Settings options will be available soon.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursePage;
