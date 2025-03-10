require('dotenv').config();
const { Sequelize } = require('sequelize'); // Import Sequelize
const { ENV_INFO, getLogMetadata } = require('../../utils/timeUtils');
const logger = require('../../utils/logger');

logger.info('Loading configuration...', getLogMetadata());

const config = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        get timestamp() {
            return ENV_INFO.timestamp;
        },
        apiPrefix: process.env.API_PREFIX || '/api/v1',
        get currentUser() {
            return ENV_INFO.user;
        }
    },
    db: {
        development: {
            url: process.env.DATABASE_URL || 'postgresql://postgres:chunnu%402204@localhost:5432/pinduoduo_app',
            dialect: 'postgres',
            logging: (msg) => logger.debug(msg, getLogMetadata({ context: 'sequelize' })),
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        test: {
            url: process.env.TEST_DATABASE_URL,
            dialect: 'postgres',
            logging: false
        },
        production: {
            url: process.env.DATABASE_URL,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 10,
                min: 2,
                acquire: 60000,
                idle: 10000
            },
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
        jwtExpire: process.env.JWT_EXPIRE || '24h',
        get currentUser() {
            return ENV_INFO.user;
        },
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    webPush: {
        vapidKeys: {
            publicKey: process.env.VAPID_PUBLIC_KEY,
            privateKey: process.env.VAPID_PRIVATE_KEY
        },
        contact: process.env.VAPID_SUBJECT || "mailto:your-email@example.com"
    },
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
        dir: process.env.LOG_DIR || 'logs',
        maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true
    },
    upload: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
        path: process.env.UPLOAD_PATH || 'uploads/',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    websocket: {
        port: parseInt(process.env.WS_PORT) || 3001,
        path: '/socket.io',
        pingTimeout: 30000,
        pingInterval: 25000
    },
    groupBuy: {
        expiryHours: 24,
        minSize: 2,
        maxSize: 10
    }
};

// Initialize Sequelize instance based on the environment
const sequelize = new Sequelize(config.db[config.server.env].url, {
    dialect: config.db[config.server.env].dialect,
    logging: config.db[config.server.env].logging,
    pool: config.db[config.server.env].pool,
    dialectOptions: config.db[config.server.env].dialectOptions
});

// Database connection test function
const testConnection = async () => {
    logger.info('Beginning database connection test...', getLogMetadata());
    
    const timeoutMs = 5000; // 5 seconds timeout
    
    try {
        const connectPromise = sequelize.authenticate();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Database connection timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });

        logger.info('Waiting for database response...', getLogMetadata());
        
        await Promise.race([connectPromise, timeoutPromise]);
        
        logger.info('Database connection test successful', getLogMetadata());
        return true;
    } catch (error) {
        logger.error('Database connection test failed:', getLogMetadata({
            error: error.message,
            stack: error.stack
        }));
        // Try to close any hanging connections
        try {
            await sequelize.close();
        } catch (closeError) {
            logger.error('Error while closing connection:', getLogMetadata({
                error: closeError.message
            }));
        }
        throw error;
    }
};

// Add the testConnection function to the config object
config.testConnection = testConnection;

logger.info('Configuration loaded successfully', getLogMetadata({
    dbDialect: config.db[ENV_INFO.environment].dialect,
    environment: config.server.env
}));

module.exports = config;