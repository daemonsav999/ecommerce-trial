const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Importing middleware
const { authenticateUser } = require('./middleware/authentication');
const { rateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');
const { validateRequest } = require('./middleware/validateRequest');

const app = express();

// Basic Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Request Logging Middleware
app.use(requestLogger);

// Rate Limiting Middleware
app.use('/api', rateLimiter);

// Authentication Middleware
app.use('/api', authenticateUser);

// Request Validation Middleware
app.use(validateRequest);

// API Routes (to be added)
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/cart', require('./routes/cart'));

// Error Handling Middleware (should be last)
app.use(errorHandler);

module.exports = app;