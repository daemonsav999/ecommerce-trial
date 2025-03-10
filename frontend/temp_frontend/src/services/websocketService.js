const socketIO = require('socket.io');
const redisManager = require('../config/redis');
const logger = require('../config/logger');

class WebSocketService {
  constructor() {
    this.rooms = new Map();
    this.userSessions = new Map();
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
      },
      pingTimeout: 60000,
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    socket.on('auth', async (token) => {
      try {
        const user = await this.validateToken(token);
        this.userSessions.set(socket.id, user._id);
        
        // Join user's personal room
        socket.join(`user:${user._id}`);
        
        // Send initial state
        this.sendUserState(socket, user._id);
      } catch (error) {
        socket.emit('auth_error', { message: 'Authentication failed' });
      }
    });

    socket.on('join_group_buy', async (groupBuyId) => {
      const userId = this.userSessions.get(socket.id);
      if (!userId) return;

      socket.join(`group_buy:${groupBuyId}`);
      await this.updateGroupBuyParticipants(groupBuyId);
    });

    socket.on('disconnect', () => {
      const userId = this.userSessions.get(socket.id);
      if (userId) {
        this.userSessions.delete(socket.id);
      }
    });
  }

  async updateGroupBuyParticipants(groupBuyId) {
    const participants = await redisManager.get(`group_buy:${groupBuyId}:participants`);
    this.io.to(`group_buy:${groupBuyId}`).emit('participants_update', {
      groupBuyId,
      participants: JSON.parse(participants)
    });
  }

  broadcastGroupBuyUpdate(groupBuyId, data) {
    this.io.to(`group_buy:${groupBuyId}`).emit('group_buy_update', data);
  }
}

module.exports = new WebSocketService();