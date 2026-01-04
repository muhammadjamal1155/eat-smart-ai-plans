import { useState, useCallback } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: Date;
}

export const useErrorBoundary = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((error: Error, errorInfo?: unknown) => {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
    };

    setError(errorData);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorData);
      console.error('Error info:', errorInfo);
    }

    // Here you could send to error reporting service
    // reportToService(errorData);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const throwError = useCallback((error: Error) => {
    captureError(error);
    throw error;
  }, [captureError]);

  return {
    error,
    captureError,
    clearError,
    throwError,
  };
};