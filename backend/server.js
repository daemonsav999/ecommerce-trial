require("dotenv").config();
const { ENV_INFO } = require('./utils/timeUtils');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const webpush = require("web-push");
const helmet = require('helmet');
const { sequelize, testConnection } = require('./config/db');
const config = require("./src/config/config");
const logger = require('./utils/logger');
const path = require('path');

// Immediate logging to verify logger is working with dynamic timestamp
logger.info('Starting application initialization...', {
  timestamp: ENV_INFO.timestamp,
  user: ENV_INFO.user
});

// Import Sequelize Models with logging
let Product, User, Order, GroupBuy;
try {
  ({ Product, User, Order, GroupBuy } = require('./models'));
  logger.info('Models imported successfully', {
    timestamp: ENV_INFO.timestamp
  });
} catch (error) {
  logger.error('Failed to import models:', {
    error: error.message,
    timestamp: ENV_INFO.timestamp
  });
  process.exit(1);
}

// Import Routes with logging
let authRoutes, productRoutes, groupBuyingRoutes, orderRoutes, gamificationRoutes, errorHandler;
try {
  authRoutes = require("./routes/authRoutes");
  productRoutes = require("./routes/productRoutes");
  groupBuyingRoutes = require("./routes/groupBuyingRoutes");
  orderRoutes = require("./routes/orderRoutes");
  gamificationRoutes = require("./routes/gamificationRoutes");
  errorHandler = require("./middleware/errorHandler");
  logger.info('Routes imported successfully', {
    timestamp: ENV_INFO.timestamp
  });
} catch (error) {
  logger.error('Failed to import routes:', {
    error: error.message,
    timestamp: ENV_INFO.timestamp
  });
  process.exit(1);
}

// Create Express app and HTTP server with logging
const app = express();
const server = http.createServer(app);
logger.info('Express and HTTP server created');

// Initialize Socket.io with config and logging
let io;
try {
  io = new Server(server, {
    cors: config.cors // Ensure this is properly defined in your config file
  });
  logger.info('Socket.io initialized successfully', {
    cors: config.cors,
    timestamp: ENV_INFO.timestamp
  });
} catch (error) {
  logger.error('Socket.io initialization failed:', {
    error: error.message,
    timestamp: ENV_INFO.timestamp
  });
  process.exit(1);
}

// Security Middleware with logging
app.use(helmet());
logger.info('Helmet security middleware initialized');

// Basic Middleware with logging
app.use(cors(config.cors)); // Ensure config.cors is properly defined
logger.info('CORS middleware initialized', { cors: config.cors });

app.use(bodyParser.json());
logger.info('Body parser middleware initialized');

app.use(logger.middleware);
logger.info('Logger middleware initialized');

// Add explicit database connection check
logger.info('Verifying database connection...', {
  timestamp: ENV_INFO.timestamp
});

// Log database configuration
logger.info('Database configuration:', {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  host: new URL(process.env.DATABASE_URL).hostname,
  database: new URL(process.env.DATABASE_URL).pathname.slice(1),
  timestamp: ENV_INFO.timestamp
});

// Test database connection with timeout
logger.info('Testing database connection with timeout...', {
  timestamp: ENV_INFO.timestamp
});

// Test database connection with timeout
Promise.race([
  testConnection(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Database connection timeout')), 10000)
  )
])
  .then(() => {
    logger.info('Database connection verified', {
      timestamp: ENV_INFO.timestamp
    });

    // Continue with server initialization
    logger.info('Initializing API routes...', {
      timestamp: ENV_INFO.timestamp
    });

    // Initialize routes
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/groupbuy", groupBuyingRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/gamification", gamificationRoutes);

    logger.info('API routes initialized', {
      timestamp: ENV_INFO.timestamp
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info('Server started successfully', {
        port: PORT,
        timestamp: ENV_INFO.timestamp
      });

      // Log startup banner
      console.log(`
╔════════════════════════════════════════════════════╗
║                E-Commerce Server                  ║
║--------------------------------------------       ║
║  Status: Running                                  ║
║  Port: ${PORT.toString().padEnd(41)}║
║  Environment: ${ENV_INFO.environment.padEnd(35)}║
║  Time: ${ENV_INFO.timestamp.padEnd(39)}║
║  User: ${ENV_INFO.user.padEnd(41)}║
╚════════════════════════════════════════════════════╝
      `);
    });
  })
  .catch(error => {
    logger.error('Failed to verify database connection:', {
      timestamp: ENV_INFO.timestamp,
      error: error.message,
      stack: error.stack
    });

    // Exit after ensuring logs are written
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

// Web Push Configuration with logging
try {
  webpush.setVapidDetails(
    config.webPush.contact,
    config.webPush.vapidKeys.publicKey,
    config.webPush.vapidKeys.privateKey
  );
  logger.info('Web Push configured successfully', {
    contact: config.webPush.contact,
    timestamp: ENV_INFO.timestamp
  });
} catch (error) {
  logger.error('Web Push configuration failed:', {
    error: error.message,
    timestamp: ENV_INFO.timestamp
  });
}

// Store push notification subscriptions
let subscriptions = [];

// Enhanced Push Notification Functions with logging
const sendNotification = async (message) => {
  logger.info('Sending push notifications', {
    subscriberCount: subscriptions.length,
    timestamp: ENV_INFO.timestamp
  });

  const notificationPromises = subscriptions.map(subscription =>
    webpush
      .sendNotification(subscription, JSON.stringify({ title: "Group Buy Update", message }))
      .catch(err => {
        logger.error("Push Notification Error:", {
          error: err.message,
          timestamp: ENV_INFO.timestamp
        });
        return null;
      })
  );

  try {
    await Promise.all(notificationPromises);
    logger.info('Push notifications sent successfully', {
      timestamp: ENV_INFO.timestamp
    });
  } catch (error) {
    logger.error('Failed to send some push notifications:', {
      error: error.message,
      timestamp: ENV_INFO.timestamp
    });
  }
};

// Time verification endpoint
app.get('/api/time', (req, res) => {
  res.json({
    currentTime: ENV_INFO.timestamp,
    user: ENV_INFO.user,
    environment: ENV_INFO.environment
  });
});

// Root endpoint for basic server check
app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: ENV_INFO.timestamp,
    user: ENV_INFO.user
  });
});

// Health Check Endpoint with enhanced logging
app.get("/api/health", async (req, res) => {
  logger.info('Health check requested', {
    timestamp: ENV_INFO.timestamp,
    ip: req.ip
  });

  try {
    await sequelize.authenticate();
    logger.info('Health check database connection successful');

    const healthStatus = {
      status: 'ok',
      timestamp: ENV_INFO.timestamp,
      environment: ENV_INFO.environment,
      currentUser: ENV_INFO.user,
      database: {
        postgresql: 'connected'
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node: process.version
      }
    };

    logger.info('Health check successful', healthStatus);
    res.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: ENV_INFO.timestamp
    });

    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: ENV_INFO.environment === 'development' ? error.message : undefined,
      timestamp: ENV_INFO.timestamp
    });
  }
});

// WebSocket Handlers with enhanced logging
io.on("connection", (socket) => {
  logger.info('WebSocket connection established', {
    socketId: socket.id,
    timestamp: ENV_INFO.timestamp
  });

  // Handle group order joining with enhanced logging
  socket.on("joinGroupOrder", async (groupOrderId) => {
    logger.info('Group order join requested', {
      socketId: socket.id,
      groupOrderId,
      timestamp: ENV_INFO.timestamp
    });

    try {
      let groupOrder = await GroupBuy.findByPk(groupOrderId, {
        include: [{ model: User, as: 'participants' }]
      });

      if (!groupOrder) {
        logger.warn('Group order not found', {
          groupOrderId,
          socketId: socket.id,
          timestamp: ENV_INFO.timestamp
        });
        return socket.emit("groupOrderError", "Group order not found");
      }

      if (groupOrder.status === "completed") {
        logger.warn('Attempted to join completed group order', {
          groupOrderId,
          socketId: socket.id,
          timestamp: ENV_INFO.timestamp
        });
        return socket.emit("groupOrderError", "Group order already completed");
      }

      await groupOrder.addParticipant(socket.userId, {
        through: { joinedAt: new Date() }
      });
      logger.info('Participant added to group order', {
        groupOrderId,
        userId: socket.userId,
        timestamp: ENV_INFO.timestamp
      });

      if (groupOrder.participants.length >= groupOrder.minParticipants) {
        groupOrder.status = "completed";
        await groupOrder.save();
        logger.info('Group buy completed', {
          groupOrderId,
          participantCount: groupOrder.participants.length,
          timestamp: ENV_INFO.timestamp
        });
        await sendNotification(`🔥 Group Buy for ${groupOrder.product} is now FULL!`);
      }

      io.emit("groupOrderUpdated", groupOrder);
      logger.info('Group order update broadcast', {
        groupOrderId,
        status: groupOrder.status,
        timestamp: ENV_INFO.timestamp
      });
    } catch (error) {
      logger.error('Error updating group order:', {
        error: error.message,
        stack: error.stack,
        groupOrderId,
        timestamp: ENV_INFO.timestamp
      });
    }
  });

  // Handle order tracking with enhanced logging
  socket.on("track-order", async (orderId) => {
    logger.info('Order tracking requested', {
      socketId: socket.id,
      orderId,
      timestamp: ENV_INFO.timestamp
    });

    try {
      const order = await Order.findByPk(orderId);
      if (order) {
        socket.join(`order-${orderId}`);
        socket.emit("order-status", {
          orderId,
          status: order.status,
          timestamp: ENV_INFO.timestamp
        });
        logger.info('Order tracking started', {
          orderId,
          status: order.status,
          timestamp: ENV_INFO.timestamp
        });
      } else {
        logger.warn('Order not found for tracking', {
          orderId,
          timestamp: ENV_INFO.timestamp
        });
      }
    } catch (error) {
      logger.error('Error tracking order:', {
        error: error.message,
        stack: error.stack,
        orderId,
        timestamp: ENV_INFO.timestamp
      });
    }
  });

  socket.on("disconnect", () => {
    logger.info('WebSocket disconnected', {
      socketId: socket.id,
      timestamp: ENV_INFO.timestamp
    });
  });
});

// Push Notification Routes with enhanced logging
app.post("/subscribe", (req, res) => {
  logger.info('New push notification subscription requested', {
    timestamp: ENV_INFO.timestamp
  });

  const subscription = req.body;
  subscriptions.push(subscription);

  logger.info('Push notification subscription added', {
    totalSubscriptions: subscriptions.length,
    timestamp: ENV_INFO.timestamp
  });

  res.status(201).json({
    message: "Subscribed for notifications!",
    timestamp: ENV_INFO.timestamp
  });
});

// Error handling middleware with enhanced logging
app.use((err, req, res, next) => {
  logger.error('Error handled by middleware:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    body: req.body,
    timestamp: ENV_INFO.timestamp
  });

  res.status(err.status || 500).json({
    error: ENV_INFO.environment === 'production'
      ? 'An error occurred'
      : err.message,
    timestamp: ENV_INFO.timestamp
  });
});

// Graceful Shutdown with enhanced logging
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`, {
    timestamp: ENV_INFO.timestamp
  });

  try {
    await sequelize.close();
    server.close(() => {
      logger.info('Server shut down successfully', {
        timestamp: ENV_INFO.timestamp
      });
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error during shutdown:', {
      timestamp: ENV_INFO.timestamp,
      error: error.message
    });
    process.exit(1);
  }
};

// Enhanced Error Handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    timestamp: ENV_INFO.timestamp
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    reason: reason,
    timestamp: ENV_INFO.timestamp
  });
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;