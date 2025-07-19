import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/Auth/AuthPage';
import CompleteSignupPage from './pages/Auth/CompleteSignupPage';
import { Dashboard } from './pages/Dashboard/Dashboard';
import {UserProfile} from './pages/Profile/UserProfile';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ThemeProvider } from "@/components/theme-provider"
import { StudentDashboardProvider } from './context/StudentDashboardContext';
import SiteHome, { CourseEnroll } from './pages/Student/SiteHome';
import Courses, { SingleCourse } from './pages/Student/Courses';
import TakeTest from './pages/Student/TakeTest';
import TestPage, { TestPageHelper } from './pages/Student/TestPage';
import { StudentSiteHomeProvider } from './context/SiteHomeContext';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
        <StudentDashboardProvider>
          <StudentSiteHomeProvider>
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

              {/* Student Side Routes */}
              <Route 
                path="/Site-Home/:schoolId" 
                element={
                  <ProtectedRoute>
                    <SiteHome />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/Site-Home/:schoolId/enroll/:courseId" 
                element={
                  <ProtectedRoute>
                    <CourseEnroll />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/courses/:progress" 
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="student/course/:courseId" 
                element={
                  <ProtectedRoute>
                    <SingleCourse />
                  </ProtectedRoute>
                } 
              />

  
              <Route 
                path="/student/user/course/test/:testId" 
                element={
                  <ProtectedRoute>
                    <TakeTest />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/exam/test/:testId" 
                element={
                  <ProtectedRoute>
                    <TestPageHelper />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/exam/test/:testId/attempt" 
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />




              {/* ------------------ Common Routes ------------------ */}

              <Route 
                path="/dashboard/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </StudentSiteHomeProvider>
        </StudentDashboardProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;