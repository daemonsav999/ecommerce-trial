// Recommended app configuration structure
export const AppConfig = {
  api: {
    baseUrl: process.env.API_URL || 'https://api.yourdomain.com',
    timeout: 15000,
  },
  features: {
    socialShopping: true,
    groupBuying: true,
    flashSales: true,
    recommendations: true,
  },
  cache: {
    productTTL: 300, // 5 minutes
    categoryTTL: 3600, // 1 hour
  },
  performance: {
    imageLazyLoading: true,
    prefetch: true,
    optimisticUI: true,
  }
};