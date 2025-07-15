import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  School, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Users,
  Trophy
} from 'lucide-react';
import type { CreateCourseData } from '@/types/course';
import DashboardLayout from '@/components/layout/DashboardLayout'
// import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual API calls
const schools = [
  { id: 'SCET', name: 'School of Computer Engineering and Technology' },
  { id: 'SEE', name: 'School of Electrical Engineering' },
  { id: 'SCE', name: 'School of Chemical Engineering' },
  { id: 'SHES', name: 'School of Humanities and Engineering Science' },
  { id: 'SMCE', name: 'School of Mechanical and Civil Engineering' },
  { id: 'SD', name: 'School of Design' }
];


const semesters = [
  { id: '1', name: 'Semester 1' },
  { id: '2', name: 'Semester 2' },
  { id: '3', name: 'Semester 3' },
  { id: '4', name: 'Semester 4' },
  { id: '5', name: 'Semester 5' },
  { id: '6', name: 'Semester 6' },
  { id: '7', name: 'Semester 7' },
  { id: '8', name: 'Semester 8' }
];

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { createCourse, isLoading: courseLoading, error, success } = useCourse();

  const [formData, setFormData] = useState<CreateCourseData>({
    name: '',
    description: '',
    school_id: '',
    semester_id: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<CreateCourseData>>({});

//   // Clear messages on mount
//   useEffect(() => {
//     clearMessages();
//   }, [clearMessages]);

  // Redirect if success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard/courses');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);


  // Show loading skeleton while auth is loading
  if (authLoading) {
    return <LoadingSkeleton />;
  }

  // Show unauthorized message if not a teacher
  if (!user || user.role !== 'TEACHER') {
    return <UnauthorizedAccess />;
  }

  const validateForm = (): boolean => {
    const errors: Partial<CreateCourseData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Course name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Course name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Course name must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Course description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!formData.school_id) {
      errors.school_id = 'School/Department is required';
    }

    if (!formData.semester_id) {
      errors.semester_id = 'Semester is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createCourse(formData);
    } catch (err) {
      // Error is handled by context
     console.error('Failed to create course:', err);
    }
  };

  const handleInputChange = (field: keyof CreateCourseData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Courses", href: "/dashboard/courses" },
        { label: "Create Course", isCurrentPage: true }
      ]}
    >
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* <Button
            variant="ghost"
            onClick={() => navigate('/courses')}
            className="mb-4 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button> */}
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Course
              </h1>
              <p className="text-muted-foreground">
                Set up a new course for your students
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  Course Information
                </CardTitle>
                <CardDescription>
                  Fill in the details to create your course
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Course Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Course Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Advanced Data Structures"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`transition-all duration-200 ${
                        validationErrors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'focus:border-blue-500'
                      }`}
                      disabled={courseLoading}
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Course Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Course Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn in this course..."
                      value={formData.description}
                      onChange={(e: { target: { value: string; }; }) => handleInputChange('description', e.target.value)}
                      className={`min-h-[120px] resize-none transition-all duration-200 ${
                        validationErrors.description 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'focus:border-blue-500'
                      }`}
                      disabled={courseLoading}
                    />
                    <div className="flex justify-between items-center">
                      {validationErrors.description && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground ml-auto">
                        {formData.description.length}/500
                      </p>
                    </div>
                  </div>

                  {/* School/Department */}
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-sm font-medium">
                      School/Department *
                    </Label>
                    <Select
                      value={formData.school_id}
                      onValueChange={(value) => handleInputChange('school_id', value)}
                      disabled={courseLoading}
                    >
                      <SelectTrigger className={`transition-all duration-200 ${
                        validationErrors.school_id 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'focus:border-blue-500'
                      }`}>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            <div className="flex items-center gap-2">
                              <School className="h-4 w-4" />
                              {school.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.school_id && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.school_id}
                      </p>
                    )}
                  </div>

                  {/* Semester */}
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-sm font-medium">
                      Semester *
                    </Label>
                    <Select
                      value={formData.semester_id}
                      onValueChange={(value) => handleInputChange('semester_id', value)}
                      disabled={courseLoading}
                    >
                      <SelectTrigger className={`transition-all duration-200 ${
                        validationErrors.semester_id 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'focus:border-blue-500'
                      }`}>
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {semester.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.semester_id && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.semester_id}
                      </p>
                    )}
                  </div>

                  {/* Error/Success Messages */}
                  {error && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top-1">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 animate-in slide-in-from-top-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Separator />
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={courseLoading}
                      className="px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                    >
                      {courseLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Creating Course...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Create Course
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Clear Course Name</p>
                      <p className="text-xs text-muted-foreground">
                        Use descriptive names that students can easily understand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Detailed Description</p>
                      <p className="text-xs text-muted-foreground">
                        Include learning objectives and prerequisites
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">Correct Department</p>
                      <p className="text-xs text-muted-foreground">
                        Ensure proper categorization for easy discovery
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">1</Badge>
                    <span className="text-sm">Add course chapters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">2</Badge>
                    <span className="text-sm">Create topics & content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">3</Badge>
                    <span className="text-sm">Invite students</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">4</Badge>
                    <span className="text-sm">Track progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-end pt-4">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

// Unauthorized Access Component
const UnauthorizedAccess: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900 rounded-full w-fit">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
          Access Denied
        </CardTitle>
        <CardDescription className="mt-2">
          Only teachers can create courses. Please contact your administrator if you believe this is an error.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default CreateCoursePage;