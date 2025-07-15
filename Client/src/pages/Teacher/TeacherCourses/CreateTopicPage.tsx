/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, Plus, AlertCircle, CheckCircle2, Loader2, BookOpen, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';


const CreateTopicPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { chapterId } = useParams<{ chapterId: string }>();
  const { chapterName } = useParams<{ chapterName: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    createTopic, 
    currentChapter, 
    isLoading, 
    error, 
    success, 
  } = useCourse();

  const [topicName, setTopicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!topicName.trim() || !chapterId) return;

    setIsSubmitting(true);
    try {
      await createTopic(chapterId, topicName.trim());
      if (!error) {
        // Navigate back to chapter details or topics list
        navigate(`/dashboard/courses/${courseId}`);
      }
    } catch (err) {
      // Error is handled by context
        console.error('Failed to create topic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  // Show loading skeleton while checking auth or loading chapter
  if (authLoading || (isLoading && !currentChapter)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
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
    return null;
  }

  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Courses', href: '/dashboard/courses' },
        { label: chapterName || 'Chapter', href: `/dashboard/courses/${courseId}` },
        { label: 'Create Topic', isCurrentPage: true }
      ]}
    >
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chapter
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Topic
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Add a new topic to {chapterName || 'your chapter'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-400/10 dark:to-blue-400/10 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Topic Information
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Enter the details for your new topic. Make it specific and focused on a single concept.
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

            <div onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Name */}
              <div className="space-y-2">
                <Label htmlFor="topicName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Topic Name *
                </Label>
                <Input
                  id="topicName"
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Enter topic name (e.g., Binary Search Trees, Sorting Algorithms)"
                  className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose a specific, focused name for your topic
                </p>
              </div>

              {/* Chapter Info Display */}
              {currentChapter && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Adding to Chapter:
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {currentChapter.name}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Chapter ID: {currentChapter.chapter_id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!topicName.trim() || isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Topic...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Topic
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
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Topic Creation Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Stay Focused</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Each topic should cover one specific concept or skill
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Use Clear Names</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choose names that clearly indicate what students will learn
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Build Progressively</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Order topics from basic to advanced concepts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Add Content Later</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can add lessons, resources, and assessments after creation
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Examples Card */}
        <Card className="mt-4 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Example Topic Names
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {[
                "Introduction to Variables",
                "For Loops and Iteration",
                "Binary Search Algorithm",
                "Object-Oriented Programming",
                "Database Normalization",
                "React Component Lifecycle"
              ].map((example, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-full border border-emerald-200 dark:border-emerald-700"
                >
                  {example}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default CreateTopicPage;