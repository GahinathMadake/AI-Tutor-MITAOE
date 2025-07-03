import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <CardTitle>404 - Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => navigate('/')} className="w-full">
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;