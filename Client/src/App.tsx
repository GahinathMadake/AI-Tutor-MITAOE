import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import AuthPage from './pages/Auth/AuthPage';
import CompleteSignupPage from './pages/Auth/CompleteSignupPage';
import { Dashboard } from './pages/Dashboard/Dashboard';
import {UserProfile} from './pages/Profile/UserProfile';
import { ViewAllCourse } from './pages/Teacher/TeacherCourses/ViewAllCourse';
import CoursePage from './pages/Teacher/TeacherCourses/Course';
import CreateCoursePage from './pages/Teacher/TeacherCourses/CreateCoursePage';
import CreateChapterPage from './pages/Teacher/TeacherCourses/CreateChapterPage';
import CreateTopicPage from './pages/Teacher/TeacherCourses/CreateTopicPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ThemeProvider } from "@/components/theme-provider"


const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
      <CourseProvider>
        <Routes>
          {/* Redirect root to auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/authenticate" element={<AuthPage />} />
          <Route path="/complete-signup" element={<CompleteSignupPage />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          >
            
          </Route>
          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/dashboard/courses" 
            element={
              <ProtectedRoute>
                <ViewAllCourse />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/courses/:courseId" 
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/dashboard/courses/create" 
            element={
              <ProtectedRoute>
                <CreateCoursePage />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/dashboard/courses/:courseName/:courseId/chapters/create" 
            element={
              <ProtectedRoute>
                <CreateChapterPage />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/dashboard/courses/:courseId/:chapterName/:chapterId/topics/create" 
            element={
              <ProtectedRoute>
                <CreateTopicPage />
              </ProtectedRoute>
            }
          />
           
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes> 
        </CourseProvider>
      </AuthProvider>
     
      </ThemeProvider>
    </Router>
  );
};

export default App;