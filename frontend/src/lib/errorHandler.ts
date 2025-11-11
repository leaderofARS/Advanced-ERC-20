// Global error handler for the application

export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      // Filter out WalletConnect and WebSocket errors
      if (error?.message?.includes('WebSocket connection closed') ||
          error?.message?.includes('WalletConnect') ||
          error?.message?.includes('Unauthorized: invalid key') ||
          error?.code === 3000) {
        console.warn('Non-critical WebSocket error ignored:', error.message || error);
        event.preventDefault(); // Prevent the error from being logged to console
        return;
      }
      
      console.error('Unhandled promise rejection:', error);
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      const error = event.error;
      
      // Filter out WalletConnect and WebSocket errors
      if (error?.message?.includes('WebSocket connection closed') ||
          error?.message?.includes('WalletConnect') ||
          error?.message?.includes('Unauthorized: invalid key')) {
        console.warn('Non-critical error ignored:', error.message);
        event.preventDefault();
        return;
      }
      
      console.error('Global error:', error);
    });
  }
}

// Utility function to check if an error is critical
export function isCriticalError(error: Error | string): boolean {
  const message = typeof error === 'string' ? error : error.message;
  
  const nonCriticalPatterns = [
    'WebSocket connection closed',
    'WalletConnect',
    'Unauthorized: invalid key',
    'Connection failed',
    'Network request failed'
  ];
  
  return !nonCriticalPatterns.some(pattern => message.includes(pattern));
}

// Safe async function wrapper
export function safeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  fallback?: any
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (!isCriticalError(error as Error)) {
        console.warn('Non-critical async error:', error);
        return fallback;
      }
      throw error;
    }
  }) as T;
}

// Safe function wrapper for sync functions
export function safe<T extends (...args: any[]) => any>(
  fn: T,
  fallback?: ReturnType<T>
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      if (!isCriticalError(error as Error)) {
        console.warn('Non-critical error:', error);
        return fallback;
      }
      throw error;
    }
  }) as T;
}