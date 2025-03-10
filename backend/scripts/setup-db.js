const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();
const logger = require('../utils/logger');
const { ENV_INFO, getTimestamp } = require('../utils/timeUtils');

// Remove static ENV_INFO as we're using the dynamic one from timeUtils

const pgPath = process.env.POSTGRES_PATH || 'C:\\Program Files\\PostgreSQL\\17\\bin';
const dbName = process.env.DB_NAME || 'pinduoduo_app';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD;

const createDatabase = () => {
  // Use PGPASSWORD environment variable for authentication
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword,
    PGTZ: 'UTC' // Set PostgreSQL timezone to UTC
  };

  const createDbCommand = `"${path.join(pgPath, 'createdb')}" -U ${dbUser} -h localhost ${dbName}`;
  
  logger.info('Attempting to create database...', {
    database: dbName,
    user: dbUser,
    timestamp: ENV_INFO.timestamp,
    timezone: 'UTC'
  });

  exec(createDbCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      if (error.message.includes('already exists')) {
        logger.info(`Database ${dbName} already exists`, {
          timestamp: ENV_INFO.timestamp
        });
        // If database exists, proceed to set timezone
        setDatabaseTimezone();
      } else {
        logger.error('Error creating database:', {
          error: error.message,
          timestamp: ENV_INFO.timestamp
        });
      }
      return;
    }
    logger.info(`Database ${dbName} created successfully`, {
      timestamp: ENV_INFO.timestamp
    });
    // Set timezone after successful creation
    setDatabaseTimezone();
  });
};

const setDatabaseTimezone = () => {
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword
  };

  // Set timezone to UTC
  const setTimezoneCommand = `"${path.join(pgPath, 'psql')}" -U ${dbUser} -h localhost -d ${dbName} -c "ALTER DATABASE ${dbName} SET timezone TO 'UTC';"`;

  exec(setTimezoneCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error('Failed to set database timezone:', {
        error: error.message,
        timestamp: ENV_INFO.timestamp
      });
      return;
    }
    logger.info('Database timezone set to UTC', {
      timestamp: ENV_INFO.timestamp
    });
    testConnection();
  });
};

const testConnection = () => {
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword
  };

  // Enhanced test command to check timezone settings
  const testCommand = `"${path.join(pgPath, 'psql')}" -U ${dbUser} -h localhost -d ${dbName} -c "\\l; SELECT current_timestamp AT TIME ZONE 'UTC', current_setting('TIMEZONE') as timezone;"`;
  
  logger.info('Testing database connection...', {
    timestamp: ENV_INFO.timestamp
  });

  exec(testCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error('Connection test failed:', {
        error: error.message,
        timestamp: ENV_INFO.timestamp
      });
      return;
    }
    logger.info('Database connection successful', {
      timestamp: ENV_INFO.timestamp,
      output: stdout.trim()
    });

    // Verify timezone settings
    verifyTimezoneSettings();
  });
};

const verifyTimezoneSettings = () => {
  const env = {
    ...process.env,
    PGPASSWORD: dbPassword
  };

  const verifyCommand = `"${path.join(pgPath, 'psql')}" -U ${dbUser} -h localhost -d ${dbName} -c "SHOW timezone;"`;

  exec(verifyCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error('Timezone verification failed:', {
        error: error.message,
        timestamp: ENV_INFO.timestamp
      });
      return;
    }
    
    const timezone = stdout.trim();
    logger.info('Database timezone verification', {
      timezone: timezone,
      timestamp: ENV_INFO.timestamp,
      systemTime: new Date().toISOString()
    });
  });
};

// Create initialization function to run everything in sequence
const initializeDatabase = async () => {
  logger.info('Starting database initialization...', {
    timestamp: ENV_INFO.timestamp,
    timezone: 'UTC',
    systemTime: new Date().toISOString()
  });

  createDatabase();
};

// Run initialization
initializeDatabase();

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Database setup interrupted', {
    timestamp: ENV_INFO.timestamp
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Database setup terminated', {
    timestamp: ENV_INFO.timestamp
  });
  process.exit(0);
});

module.exports = {
  createDatabase,
  testConnection,
  verifyTimezoneSettings
};