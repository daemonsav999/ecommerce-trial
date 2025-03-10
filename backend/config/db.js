const { Sequelize } = require('sequelize');
const config = require('../src/config/config');
const logger = require('../utils/logger');
const { ENV_INFO } = require('../utils/timeUtils');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config.db[env];

logger.info('Database configuration loaded:', {
    timestamp: ENV_INFO.timestamp,
    environment: env,
    dialect: dbConfig.dialect,
    host: new URL(dbConfig.url).hostname,
    database: new URL(dbConfig.url).pathname.slice(1)
});

// Create Sequelize instance with more detailed logging
const sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
    logging: (msg) => logger.debug(`Sequelize: ${msg}`, { timestamp: ENV_INFO.timestamp }),
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        // Add connection timeout
        connectTimeout: 10000,
        // Force PostgreSQL to use a proper timeout
        statement_timeout: 10000,
        idle_in_transaction_session_timeout: 10000
    }
});

// Immediately test the connection
logger.info('Attempting immediate database connection test...', {
    timestamp: ENV_INFO.timestamp
});

// Create a timeout promise
const timeout = new Promise((_, reject) => {
    setTimeout(() => {
        reject(new Error('Database connection timeout after 10 seconds'));
    }, 10000);
});

// Test connection immediately
Promise.race([
    sequelize.authenticate(),
    timeout
])
.then(() => {
    logger.info('Initial database connection successful', {
        timestamp: ENV_INFO.timestamp
    });
})
.catch(error => {
    logger.error('Initial database connection failed:', {
        timestamp: ENV_INFO.timestamp,
        error: error.message,
        code: error.original?.code,
        errorType: error.name,
        stack: error.stack
    });
    
    // Don't exit here, let the main application handle the error
});

// Function to test connection that can be called from server.js
const testConnection = async () => {
    try {
        logger.info('Attempting to connect to the database...', {
            timestamp: ENV_INFO.timestamp
        });
        
        await Promise.race([
            sequelize.authenticate(),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout')), 10000);
            })
        ]);
        
        logger.info('Database connection successful', {
            timestamp: ENV_INFO.timestamp
        });
        return true;
    } catch (error) {
        logger.error('Database connection failed:', {
            timestamp: ENV_INFO.timestamp,
            error: error.message,
            stack: error.stack,
            originalError: error.original // Log the original error from Sequelize
        });
        throw error;
    }
};

module.exports = {
    sequelize,
    testConnection
};