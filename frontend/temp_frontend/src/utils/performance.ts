import { Platform } from 'react-native';

export const PerformanceOptimizer = {
  // Image optimization
  getOptimizedImageURL: (url: string, width: number, height: number) => {
    return `${url}?w=${width}&h=${height}&q=75&format=webp`;
  },

  // List virtualization
  getWindowSize: () => {
    return Platform.select({
      ios: 10,
      android: 8,
      default: 10
    });
  },

  // Cache management
  getCacheConfig: () => ({
    maxSize: 1024 * 1024 * 50, // 50MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    storage: Platform.select({
      ios: 'file',
      android: 'sqlite',
      default: 'memory'
    })
  })
};