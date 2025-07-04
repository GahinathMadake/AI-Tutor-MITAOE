import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/Auth/AuthPage';
import CompleteSignupPage from './pages/Auth/CompleteSignupPage';
import DashboardPage from './pages/Student/StudentDashboard';
import {UserProfile} from './pages/Profile/UserProfile';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ThemeProvider } from "@/components/theme-provider"

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
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
                <DashboardPage />
              </ProtectedRoute>
            } 
          ></Route>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          /> 
           
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;