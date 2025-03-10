const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

const createRateLimiter = (options = {}) => {
  return rateLimit({
    store: new RedisStore({
      client: redis.client,
      prefix: 'rate-limit:'
    }),
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests, please try again later.'
    },
    ...options
  });
};

// Different rate limits for different routes
const limiters = {
  auth: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour for auth routes
    message: {
      error: 'Too many login attempts, please try again later.'
    }
  }),
  
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per 15 minutes for API routes
  }),
  
  groupBuy: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 5 // 5 group buy creations per minute
  })
};

module.exports = limiters;