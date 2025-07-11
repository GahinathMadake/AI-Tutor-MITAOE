import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import userImage from './assets/User.png';
import {
  GraduationCap,
  HelpCircle,
  ClipboardCheck,
  BookOpen,
  RefreshCcw,
  Calendar,
  Clock,
  Play,
  Trophy,
  Target,
  TrendingUp,
  User,
  Eye
} from 'lucide-react';
import type {TimelineEvent } from '@/types/studentDashboard';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { useAuth } from '@/hooks/useAuth';

// Timeline component
const TimelineItem: React.FC<{ item: TimelineEvent }> = ({ item }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'ongoing': return <Play className="h-4 w-4" />;
      case 'completed': return <Trophy className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
          <Badge className={`text-xs ${getStatusColor(item.status)} flex items-center gap-1`}>
            {getStatusIcon(item.status)}
            {item.status}
          </Badge>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{item.subject}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{item.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>{item.totalMarks} marks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading skeleton component
const DashboardLoading: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <Card className="w-full lg:w-8/12">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="w-full sm:w-7/12 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="max-w-[300px] sm:w-6/12 flex justify-center sm:justify-end">
              <Skeleton className="w-[200px] h-[200px] rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <div className="w-full lg:w-4/12 grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center space-y-2">
                <Skeleton className="h-8 w-8 mx-auto" />
                <Skeleton className="h-6 w-8 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-8 w-16 rounded-full" />
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component
const StudentDashboardContent: React.FC = () => {
  const {dashboardData, ongoingCourses, loading, timelineEvents, loadingTimeline, setTimelineStatus, timelineStatus, fetchTimelineEvents} = useStudentDashboard();

  const userName = useAuth().user?.name || "Student";

  const getFilteredTimelineEvents = (): TimelineEvent[] => {
    return timelineEvents.filter((item) => {
      const currentTime = new Date();
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);

      switch (timelineStatus) {
        case "upcoming":
          return startTime > currentTime;
        case "ongoing":
          return startTime <= currentTime && currentTime <= endTime;
        case "completed":
          return endTime < currentTime;
        default:
          return true;
      }
    });
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <Card className="w-full lg:w-8/12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-neutral-900 border-0 shadow-xl">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6 sm:gap-10">
              <div className="w-full sm:w-7/12 flex flex-col gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-200">
                  Hi {userName}! 👋<br />
                  <span className="text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-400">
                    What do you want to learn today?
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Discover courses, track progress, and achieve your learning goals seamlessly.
                </p>
                <Button className="bg-slate-300 hover:bg-slate-400 w-fit text-neutral-800 dark:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-colors">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Courses
                </Button>
              </div>
              <div className="max-w-[300px] sm:w-6/12 flex justify-center sm:justify-end">
                <div className="w-[200px] h-[200px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                  <img
                    src={userImage}
                    alt="user"
                    className='w-[200px] sm:w-[250px] md:w-[300px] max-h-[200px] object-contain'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="w-full lg:w-4/12 grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-zinc-800 dark:to-neutral-900 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <GraduationCap className="text-green-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">{dashboardData?.completedCourses || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Courses</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-zinc-800 dark:to-neutral-900 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <BookOpen className="text-blue-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">{dashboardData?.ongoingCourses || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ongoing Courses</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-zinc-800 dark:to-neutral-900 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <ClipboardCheck className="text-purple-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">{dashboardData?.testCompleted || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tests Completed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-zinc-800 dark:to-neutral-900 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <HelpCircle className="text-orange-600 w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text dark:text-gray-400">{dashboardData?.questionsSolved || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Solved</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Ongoing Courses */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Ongoing Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ongoingCourses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No ongoing courses</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ongoingCourses.map((course) => (
                      <Card key={course.id} className="bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base line-clamp-1 mb-1">{course.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {course.instructor}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {course.completedTests}/{course.totalTests} tests
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-bold text-blue-600">{course.progress}%</p>
                              <Badge variant="secondary" className="text-xs">
                                {course.schoolID}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Test Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filter Badges */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
                        <Badge
                          key={status}
                          variant={timelineStatus === status ? "default" : "secondary"}
                          className="cursor-pointer capitalize text-xs"
                          onClick={() => setTimelineStatus(status)}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={fetchTimelineEvents}
                      disabled={loadingTimeline}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCcw className={`h-4 w-4 ${loadingTimeline ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  <Separator />

                  {/* Timeline Events */}
                  {loadingTimeline ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {getFilteredTimelineEvents().length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No events available</p>
                        </div>
                      ) : (
                        getFilteredTimelineEvents().map((event) => (
                          <TimelineItem key={event.id} item={event} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboardContent;