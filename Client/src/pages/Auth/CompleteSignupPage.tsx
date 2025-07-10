import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User , CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLES, SCHOOLS } from '@/utils/api';

const CompleteSignupPage: React.FC = () => {
  const { 
    completeSignup, 
    isLoading, 
    success, 
    clearMessages, 
    isAuthenticated, 
    requiresCompletion,
    user 
  } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    prn: '',
    role: ROLES.STUDENT,
    school: ''
  });

  // Redirect if already authenticated or doesn't require completion
  if (isAuthenticated && !requiresCompletion) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requiresCompletion && !user) {
    return <Navigate to="/auth" replace />;
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.prn.trim()) {
      return;
    }
    
    clearMessages();
    await completeSignup(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Please provide additional information to complete your registration</p>
        </div>

        {/* Alerts */}
        {/* {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Complete your profile to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">PRN (Personal Registration Number) *</label>
                <Input
                  type="text"
                  placeholder="Enter your PRN"
                  value={formData.prn}
                  onChange={(e) => handleInputChange('prn', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {/* <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Select
                  value={formData.role.toString()}
                  onValueChange={(value) => handleInputChange('role', parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLES.STUDENT.toString()}>Student</SelectItem>
                    <SelectItem value={ROLES.TEACHER.toString()}>Teacher</SelectItem>
                    <SelectItem value={ROLES.ADMIN.toString()}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

                <div>
                <label className="text-sm font-medium text-gray-700">School/Institution</label>
                <Select
                    value={formData.school}
                    onValueChange={(value) => handleInputChange('school', value)}
                >
                    <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="SCET">{SCHOOLS.SCET}</SelectItem>
                    <SelectItem value="SEE">{SCHOOLS.SEE}</SelectItem>
                    <SelectItem value="SCE">{SCHOOLS.SCE}</SelectItem>
                    <SelectItem value="SHES">{SCHOOLS.SHES}</SelectItem>
                    <SelectItem value="SMCE">{SCHOOLS.SMCE}</SelectItem>
                    <SelectItem value="SD">{SCHOOLS.SD}</SelectItem>
                    </SelectContent>
                </Select>
                </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Already have an account? <Link to="/auth" className="text-blue-600 hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CompleteSignupPage;