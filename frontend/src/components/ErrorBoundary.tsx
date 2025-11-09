'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out WalletConnect WebSocket errors as they're not critical
    if (error.message?.includes('WebSocket connection closed') || 
        error.message?.includes('WalletConnect') ||
        error.message?.includes('Unauthorized: invalid key')) {
      console.warn('WalletConnect error (non-critical):', error.message);
      // Don't show error boundary for WalletConnect issues
      this.setState({ hasError: false });
      return;
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-secondary-900 rounded-xl p-6 border border-secondary-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-secondary-400 mb-4">
            An unexpected error occurred. This might be a temporary issue.
          </p>
          
          <details className="text-left mb-4">
            <summary className="text-sm text-secondary-500 cursor-pointer hover:text-secondary-400">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-error-400 bg-secondary-800 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
          
          <div className="space-y-2">
            <Button onClick={resetError} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for handling async errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    // Filter out non-critical errors
    if (error.message?.includes('WebSocket connection closed') || 
        error.message?.includes('WalletConnect') ||
        error.message?.includes('Unauthorized: invalid key')) {
      console.warn('Non-critical error ignored:', error.message);
      return;
    }
    
    console.error('Error handled:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, clearError };
}