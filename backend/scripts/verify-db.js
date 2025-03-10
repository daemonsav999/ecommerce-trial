const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

const verifyConnection = async () => {
  const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'pinduoduo_app',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: msg => logger.debug(msg)
  });

  try {
    await sequelize.authenticate();
    logger.info('Database connection verified successfully', {
      timestamp: process.env.TIMESTAMP,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
    return true;
  } catch (error) {
    logger.error('Database verification failed:', {
      error: error.message,
      timestamp: process.env.TIMESTAMP
    });
    return false;
  } finally {
    await sequelize.close();
  }
};

verifyConnection();