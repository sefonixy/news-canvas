import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Follow DRY principle by centralizing class name generation
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a standardized human-readable format
 * Implements DRY by centralizing date formatting logic
 */
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if parsing fails
  }
}

/**
 * Creates initials from a string (e.g., "New York Times" → "NY")
 * Implements DRY by centralizing initials generation logic
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, maxLength);
}

/**
 * Implements a simple memoization for expensive functions
 * Follows SOLID by providing a single-responsibility caching mechanism
 */
export function memoize<T, Args extends unknown[]>(fn: (...args: Args) => T): (...args: Args) => T {
  const cache = new Map<string, T>();
  
  return (...args: Args): T => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a delay promise for async operations
 * Follows DRY by centralizing timing logic
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncates a string to a maximum length and adds ellipsis
 * Implements DRY by centralizing string truncation logic
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Retries a function with exponential backoff
 * Follows SOLID principles through single responsibility and open for extension
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number; 
    initialDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      const delayTime = initialDelay * Math.pow(backoffFactor, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delayTime}ms`);
      await delay(delayTime);
    }
  }
  
  throw lastError;
}
