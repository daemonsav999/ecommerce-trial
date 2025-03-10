interface AppConfig {
  API_URL: string;
  WEBSOCKET_URL: string;
  GROUP_BUY_TIMEOUT: number;
  MAX_TEAM_SIZE: number;
  MIN_TEAM_SIZE: number;
  ENABLE_SOCIAL_SHARING: boolean;
  ENABLE_LOCATION_FEATURES: boolean;
}

const developmentConfig: AppConfig = {
  API_URL: 'http://localhost:3000/api',
  WEBSOCKET_URL: 'ws://localhost:3001',
  GROUP_BUY_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_TEAM_SIZE: 10,
  MIN_TEAM_SIZE: 2,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_LOCATION_FEATURES: true,
};

const productionConfig: AppConfig = {
  API_URL: process.env.API_URL || 'https://api.yourdomain.com',
  WEBSOCKET_URL: process.env.WEBSOCKET_URL || 'wss://ws.yourdomain.com',
  GROUP_BUY_TIMEOUT: 24 * 60 * 60 * 1000,
  MAX_TEAM_SIZE: 10,
  MIN_TEAM_SIZE: 2,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_LOCATION_FEATURES: true,
};

export const config: AppConfig = 
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;