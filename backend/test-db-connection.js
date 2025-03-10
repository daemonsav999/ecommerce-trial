// test-db-connection.js
const { Sequelize } = require('sequelize');
const logger = require('./utils/logger');
const { ENV_INFO } = require('./utils/timeUtils');

// Load environment variables
require('dotenv').config();

// Log environment variables for debugging
logger.info('Environment variables loaded:', {
  DATABASE_URL: process.env.DATABASE_URL,
  timestamp: ENV_INFO.timestamp
});

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(`Sequelize: ${msg}`, { timestamp: ENV_INFO.timestamp }),
  dialectOptions: {
    connectTimeout: 10000, // 10 seconds
  },
});

// Log Sequelize configuration
logger.info('Sequelize instance created with the following configuration:', {
  dialect: 'postgres',
  database: new URL(process.env.DATABASE_URL).pathname.slice(1),
  host: new URL(process.env.DATABASE_URL).hostname,
  timestamp: ENV_INFO.timestamp
});

// Test the database connection
logger.info('Attempting to connect to the database...', {
  timestamp: ENV_INFO.timestamp
});

sequelize.authenticate()
  .then(() => {
    logger.info('Database connection successful', {
      timestamp: ENV_INFO.timestamp
    });
    process.exit(0); // Exit with success code
  })
  .catch(error => {
    logger.error('Database connection failed:', {
      timestamp: ENV_INFO.timestamp,
      error: error.message,
      stack: error.stack,
      originalError: error.original // Log the original error from Sequelize
    });
    process.exit(1); // Exit with error code
  });