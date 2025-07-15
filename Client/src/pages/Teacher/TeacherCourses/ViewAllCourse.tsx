import { BookOpen, Clock, User, Search, Filter, Plus, GraduationCap, Building2, Calendar, Star, TrendingUp, Eye, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { useCourse } from "@/hooks/useCourse"
import { useAuth } from '@/hooks/useAuth'
import type { Course } from '@/types/course'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState } from 'react'

export function ViewAllCourse() {
  const { courses, error } = useCourse()
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  
  const isStudent = user?.role === "STUDENT"
  const isTeacher = user?.role === "TEACHER"

  // Enhanced skeleton with better visual hierarchy and dark theme support
  const CourseSkeleton = () => (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
      <CardHeader className="relative pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )

  // Enhanced course card with better visual design and dark theme support
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card h-full flex flex-col">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 opacity-60" />
      
      {/* Decorative Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-800/30 dark:to-indigo-700/30 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-300 dark:from-purple-800/30 dark:to-pink-700/30 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
      
      <CardHeader className="relative pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.name}
                </CardTitle>
                {/* <p className="text-xs text-muted-foreground font-medium">Course ID: {course.course_id}</p> */}
              </div>
            </div>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-3">
              {course.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              Active
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Teacher Info */}
        <div className="flex items-center space-x-3 p-3 bg-background/50 dark:bg-card/50 rounded-lg backdrop-blur-sm">
          <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
            {/* <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacher_id}`} /> */}
            {/* <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                {user?.name?.charAt(0).toUpperCase() || "T"}
            </AvatarFallback> */}
            <User/>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Teacher Name: {user?.name}</p>
            <p className="text-xs text-muted-foreground">Course Instructor</p>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-card/50 p-2 rounded-lg backdrop-blur-sm">
            <Building2 className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium text-foreground">School</p>
              <p className="text-xs">{course.school_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 dark:bg-card/50 p-2 rounded-lg backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <p className="font-medium text-foreground">Semester</p>
              <p className="text-xs">{course.semester_id}</p>
            </div>
          </div>
        </div>

        {/* Course Metadata */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>Updated recently</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              window.location.href = `/dashboard/courses/${course.course_id}`
            }}
          >
            {isStudent ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                View Course
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Manage Course
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Filter courses based on search and filter
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    // Add more filter logic here based on filterBy state
    return matchesSearch
  })

  // Error state with better design and dark theme support
  if (error) {
    return (
      <DashboardLayout 
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", isCurrentPage: true }
        ]}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Courses</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: isStudent ? "Available Courses" : "All Courses", isCurrentPage: true }
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {isStudent ? "Available Courses" : "All Courses"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {isStudent 
                      ? "Explore and enroll in courses to enhance your learning journey"
                      : "Manage and view all courses in the system"
                    }
                  </p>
                </div>
              </div>
              
              {isTeacher && (
                <Button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = "/dashboard/courses/create"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 bg-background/70 dark:bg-card/70 backdrop-blur-sm shadow-md focus:shadow-lg transition-all duration-300"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-48 border-0 bg-background/70 dark:bg-card/70 backdrop-blur-sm shadow-md">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* <Card className="border-0 shadow-md bg-card/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                      <p className="text-2xl font-bold text-foreground">{courses?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
              {/* <Card className="border-0 shadow-md bg-card/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                      <p className="text-2xl font-bold text-foreground">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
              {/* <Card className="border-0 shadow-md bg-card/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold text-foreground">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Courses Grid */}
          {!isLoading && filteredCourses && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: Course) => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          )}

          {/* Enhanced Empty State */}
          {!isLoading && (!filteredCourses || filteredCourses.length === 0) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No courses found" : "No courses available"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search terms or filters"
                  : isTeacher 
                    ? "Start by creating your first course to get students engaged"
                    : "Check back later for new courses or contact your administrator"
                }
              </p>
              {isTeacher && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = "/courses/add"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}