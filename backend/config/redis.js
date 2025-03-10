const Redis = require('ioredis');
const logger = require('./logger');

class RedisManager {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
    });
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis Get Error for key ${key}:`, error);
      throw error;
    }
  }

  async set(key, value, expiry = null) {
    try {
      if (expiry) {
        return await this.client.set(key, value, 'EX', expiry);
      }
      return await this.client.set(key, value);
    } catch (error) {
      logger.error(`Redis Set Error for key ${key}:`, error);
      throw error;
    }
  }
}

module.exports = new RedisManager();