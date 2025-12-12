/**
 * Simple in-memory cache with TTL (Time To Live) for database queries
 * This reduces database load and improves response times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry with optional custom TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Singleton instance
export const queryCache = new QueryCache();

/**
 * Generate cache key from function name and parameters
 */
export function generateCacheKey(functionName: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return functionName;
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|');
  
  return `${functionName}:${sortedParams}`;
}

/**
 * Cache decorator for async functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    invalidateOn?: string[]; // Patterns to invalidate when this function is called
  }
): T {
  return (async (...args: Parameters<T>) => {
    const key = options?.keyGenerator
      ? options.keyGenerator(...args)
      : generateCacheKey(fn.name, args[0] || {});

    // Check cache first
    const cached = queryCache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function
    const result = await fn(...args);

    // Cache result
    queryCache.set(key, result, options?.ttl);

    // Invalidate related caches if specified
    if (options?.invalidateOn) {
      options.invalidateOn.forEach(pattern => {
        queryCache.invalidatePattern(pattern);
      });
    }

    return result;
  }) as T;
}

