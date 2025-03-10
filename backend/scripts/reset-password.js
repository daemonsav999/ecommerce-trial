const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();
const logger = require('../utils/logger');

const ENV_INFO = {
  timestamp: '2025-03-08 11:44:35', // Updated to current timestamp
  user: 'daemonsav999'
};

const pgPath = process.env.POSTGRES_PATH;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const resetPassword = () => {
  // Set PGPASSWORD as an environment variable
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword
  };

  const psqlCommand = `"${path.join(pgPath, 'psql')}" -U ${dbUser} -h localhost -d postgres -c "ALTER USER postgres WITH PASSWORD '${dbPassword}';"`;
  
  logger.info('Attempting to reset PostgreSQL password...', {
    timestamp: ENV_INFO.timestamp,
    user: ENV_INFO.user
  });

  exec(psqlCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error('Password reset failed:', {
        error: error.message,
        timestamp: ENV_INFO.timestamp
      });
      return;
    }
    logger.info('Password reset successful', {
      timestamp: ENV_INFO.timestamp,
      user: ENV_INFO.user
    });
  });
};

// Try connecting first
const testConnection = () => {
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword
  };

  const testCommand = `"${path.join(pgPath, 'psql')}" -U ${dbUser} -h localhost -d postgres -c "SELECT 1;"`;
  
  exec(testCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.info('Initial connection failed, proceeding with password reset...', {
        timestamp: ENV_INFO.timestamp
      });
      resetPassword();
    } else {
      logger.info('Connection successful, no password reset needed', {
        timestamp: ENV_INFO.timestamp
      });
    }
  });
};

// Start the process
testConnection();