import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AuthPage: React.FC = () => {
  const { login, authenticate, isLoading, error, success, clearMessages, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    console.log('User is already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  else{
    console.log('User is not authenticated, showing auth page');
  }

  const handleSendMagicLink = async (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (!email.trim()) return;
    
    clearMessages();
    await login(email);
  };

  const handleAuthenticate = async (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (!authToken.trim()) return;
    
    clearMessages();
    await authenticate(authToken);
  };

  const handleNewMagicLink = () => {
    clearMessages();
    setAuthToken('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Magic Link Login
            </CardTitle>
            <CardDescription>
              Enter your email to receive a magic link for secure authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMagicLink(e)}
                />
              </div>
              <Button onClick={handleSendMagicLink} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </div>

            {success && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Authentication Token</label>
                    <Input
                      type="text"
                      placeholder="Enter the token from your email"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      className="mt-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate(e)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAuthenticate} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        'Authenticate'
                      )}
                    </Button>
                    <Button onClick={handleNewMagicLink} variant="outline" disabled={isLoading}>
                      New Link
                    </Button>
                  </div>
                </div>
              </>
            )}

            {error && error.includes('expired') && (
              <div className="mt-4">
                <Button onClick={handleNewMagicLink} variant="outline" className="w-full">
                  Request New Magic Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Secure authentication powered by Stytch</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;