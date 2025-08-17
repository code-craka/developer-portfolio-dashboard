/**
 * Caching utilities for API responses and static data
 * Implements in-memory caching with TTL for production optimization
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100; // Maximum number of cache entries

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry with TTL
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
const cache = new MemoryCache();

/**
 * Cache configuration for different data types
 */
export const CacheConfig = {
  PROJECTS: {
    key: 'projects:all',
    ttl: 5 * 60 * 1000, // 5 minutes
  },
  FEATURED_PROJECTS: {
    key: 'projects:featured',
    ttl: 10 * 60 * 1000, // 10 minutes
  },
  EXPERIENCES: {
    key: 'experiences:all',
    ttl: 15 * 60 * 1000, // 15 minutes
  },
  CONTACT_MESSAGES: {
    key: 'contacts:all',
    ttl: 2 * 60 * 1000, // 2 minutes
  },
  DB_HEALTH: {
    key: 'health:db',
    ttl: 30 * 1000, // 30 seconds
  },
} as const;

/**
 * Generic cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache the result
  cache.set(key, data, ttlMs);
  
  return data;
}

/**
 * Invalidate cache entries by pattern
 */
export function invalidateCache(pattern: string): void {
  const keys = Array.from(cache['cache'].keys());
  const matchingKeys = keys.filter(key => key.includes(pattern));
  
  matchingKeys.forEach(key => cache.delete(key));
}

/**
 * Cache middleware for API routes
 */
export function createCacheHeaders(maxAge: number, staleWhileRevalidate?: number) {
  const cacheControl = staleWhileRevalidate
    ? `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    : `public, max-age=${maxAge}, s-maxage=${maxAge}`;

  return {
    'Cache-Control': cacheControl,
    'CDN-Cache-Control': `public, max-age=${maxAge}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${maxAge}`,
  };
}

export { cache };