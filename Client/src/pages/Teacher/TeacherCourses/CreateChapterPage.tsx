/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, BookOpen, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout'

const CreateChapterPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseName } = useParams<{ courseName: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    createChapter, 
    currentCourse, 
    isLoading, 
    error, 
    success, 
  } = useCourse();

  const [chapterName, setChapterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);




  // Clear messages on component mount
    //   useEffect(() => {
    //     clearMessages();
    //   }, [clearMessages]);

      // Redirect if success
      useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            navigate(`/dashboard/courses/${courseId}`);
          }, 2000);
          return () => clearTimeout(timer);
        }
      }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterName.trim() || !courseId) return;

    setIsSubmitting(true);
    try {
      await createChapter(courseId, chapterName.trim());
      if (!error) {
        // Navigate back to course structure or chapters list
        navigate(`/dashboard/courses/${courseId}`);
      }
    } catch (err) {
      // Error is handled by context
        console.error('Failed to create chapter:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  // Show loading skeleton while checking auth or loading course
  if (authLoading || (isLoading && !currentCourse)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardHeader className="space-y-4">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Don't render if user is not a teacher
  if (!user || user.role !== 'TEACHER') {
    return <UnauthorizedAccess />;
  }

   console.log('Current Course:', currentCourse);
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Courses', href: '/dashboard/courses' },
        { label: courseName || 'Course', href: `/dashboard/courses/${courseId}` },
        { label: 'Create Chapter', isCurrentPage: true }
      ]}
    >
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button> */}
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Chapter
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Add a new chapter to {currentCourse?.name || 'your course'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Chapter Information
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Enter the details for your new chapter. Make it descriptive and engaging.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-300">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chapter Name */}
              <div className="space-y-2">
                <Label htmlFor="chapterName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Chapter Name *
                </Label>
                <Input
                  id="chapterName"
                  type="text"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="Enter chapter name (e.g., Introduction to Algorithms)"
                  className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose a clear, descriptive name for your chapter
                </p>
              </div>

              {/* Course Info Display */}
              {currentCourse && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Adding to Course:
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {currentCourse.name}
                  </p>
                  {currentCourse.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currentCourse.description}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!chapterName.trim() || isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Chapter...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Chapter
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Chapter Creation Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Be Descriptive</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use clear, specific names that students can easily understand
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Logical Order</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Structure chapters in a logical learning sequence
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Add Topics Later</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can add topics and content after creating the chapter
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Edit Anytime</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Chapter names and structure can be modified later
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};


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
          Only teachers can create chapters. Please contact your administrator if you believe this is an error.
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

export default CreateChapterPage;