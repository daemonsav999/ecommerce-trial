import { openDB, IDBPDatabase } from 'idb';

interface CacheConfig {
  name: string;
  version: number;
  maxAge: number;
  maxItems: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private db: IDBPDatabase | null = null;
  
  private cacheConfigs: { [key: string]: CacheConfig } = {
    products: {
      name: 'products-cache',
      version: 1,
      maxAge: 60 * 60 * 1000, // 1 hour
      maxItems: 1000,
    },
    orders: {
      name: 'orders-cache',
      version: 1,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxItems: 100,
    },
    user: {
      name: 'user-cache',
      version: 1,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxItems: 1,
    },
  };

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async initialize(): Promise<void> {
    this.db = await openDB('app-cache', 1, {
      upgrade(db) {
        // Create object stores for different types of data
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      },
    });
  }

  async set(key: string, value: any, type: keyof typeof this.cacheConfigs): Promise<void> {
    if (!this.db) await this.initialize();

    const config = this.cacheConfigs[type];
    const entry = {
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + config.maxAge,
    };

    await this.db?.put('cache', entry, `${type}:${key}`);
    await this.cleanup(type);
  }

  async get(key: string, type: keyof typeof this.cacheConfigs): Promise<any | null> {
    if (!this.db) await this.initialize();

    const entry = await this.db?.get('cache', `${type}:${key}`);
    
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      await this.delete(`${type}:${key}`);
      return null;
    }

    return entry.value;
  }

  private async cleanup(type: keyof typeof this.cacheConfigs): Promise<void> {
    const config = this.cacheConfigs[type];
    const tx = this.db?.transaction('cache', 'readwrite');
    const store = tx?.objectStore('cache');

    if (!store) return;

    // Get all keys for this type
    const keys = await store.getAllKeys();
    const typeKeys = keys.filter(k => k.toString().startsWith(`${type}:`));

    if (typeKeys.length > config.maxItems) {
      // Remove oldest entries
      const numToDelete = typeKeys.length - config.maxItems;
      const entriesArray = await Promise.all(
        typeKeys.map(async key => ({
          key,
          entry: await store.get(key),
        }))
      );

      // Sort by timestamp and delete oldest
      entriesArray
        .sort((a, b) => a.entry.timestamp - b.entry.timestamp)
        .slice(0, numToDelete)
        .forEach(({ key }) => store.delete(key));
    }
  }
}