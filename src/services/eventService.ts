import { EventEmitter } from 'events';
import { RedisManager } from '../config/redis';
import { WebSocketService } from './websocketService';

interface EventData {
  type: string;
  payload: any;
  timestamp: number;
}

class EventService extends EventEmitter {
  private redis: RedisManager;
  private websocket: WebSocketService;

  constructor() {
    super();
    this.redis = new RedisManager();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.on('group_buy_update', this.handleGroupBuyUpdate.bind(this));
    this.on('price_update', this.handlePriceUpdate.bind(this));
    this.on('inventory_update', this.handleInventoryUpdate.bind(this));
  }

  async publishEvent(event: EventData) {
    try {
      await this.redis.publish('app_events', JSON.stringify(event));
      this.emit(event.type, event.payload);
    } catch (error) {
      console.error('Error publishing event:', error);
      throw error;
    }
  }

  private async handleGroupBuyUpdate(payload: any) {
    const { groupBuyId, data } = payload;
    await this.redis.set(`group_buy:${groupBuyId}:state`, JSON.stringify(data));
    this.websocket.broadcastGroupBuyUpdate(groupBuyId, data);
  }

  private async handlePriceUpdate(payload: any) {
    // Handle dynamic price updates
  }

  private async handleInventoryUpdate(payload: any) {
    // Handle inventory updates
  }
}

export const eventService = new EventService();