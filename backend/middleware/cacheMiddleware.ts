import { RedisCache } from '../services/cache';
import { Request, Response, NextFunction } from 'express';

export class CacheManager {
  private cache: RedisCache;
  
  constructor() {
    this.cache = new RedisCache();
  }

  cacheResponse(duration: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const key = this.generateCacheKey(req);
      const cachedResponse = await this.cache.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.originalJson = res.json;
      res.json = (body: any) => {
        this.cache.set(key, JSON.stringify(body), duration);
        return res.originalJson(body);
      };

      next();
    };
  }

  invalidateCache(patterns: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(
        patterns.map(pattern => this.cache.deletePattern(pattern))
      );
      next();
    };
  }
}  