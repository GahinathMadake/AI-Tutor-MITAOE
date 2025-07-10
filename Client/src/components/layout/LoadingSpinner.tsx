import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;


export const LoadingSpinnerWithoutHight: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};