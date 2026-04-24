// lib/errorHandler.ts
export function handleError(error: unknown, context: string): string {
  console.error(`[${context}]`, error);

  if (error instanceof Error) {
    if (error.message.includes('auth')) {
      return 'Authentication failed. Please check your credentials.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('validation')) {
      return 'Invalid input. Please check your data.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}