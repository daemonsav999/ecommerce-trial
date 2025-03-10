// utils/logger.js
const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info', // Log level based on environment
  format: combine(
    colorize(), // Add colors to logs
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    align(), // Align log messages
    logFormat // Apply the custom log format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),

    // Log errors to a file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log errors to this file
    }),

    // Log all messages to a combined file
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
  exceptionHandlers: [
    // Handle uncaught exceptions
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    // Handle unhandled promise rejections
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Add a stream for morgan (HTTP request logging)
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;