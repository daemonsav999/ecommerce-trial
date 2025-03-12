const Redis = require('ioredis');
const socketIO = require('socket.io');

class RealtimeService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.groupBuyCounters = {};
  }

  initialize(server) {
    this.io = socketIO(server);
    
    this.io.on('connection', (socket) => {
      socket.on('join-group-buy', (groupBuyId) => {
        socket.join(`group-buy-${groupBuyId}`);
        this.emitGroupBuyStats(groupBuyId);
      });
      
      socket.on('user-activity', (data) => {
        this.updateUserActivity(data);
      });
    });
  }

  async updateGroupBuyCounter(groupBuyId) {
    const viewers = await this.redis.get(`group-buy:${groupBuyId}:viewers`);
    this.io.to(`group-buy-${groupBuyId}`).emit('viewer-count', {
      count: viewers,
      recentJoins: await this.getRecentJoins(groupBuyId)
    });
  }

  async trackUserBehavior(userId, action) {
    await this.redis.zadd('user:actions', Date.now(), JSON.stringify({
      userId,
      action,
      timestamp: Date.now()
    }));
  }
}