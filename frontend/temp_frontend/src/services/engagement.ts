import { socketService } from './SocketService';
import { notificationService } from './NotificationService';
import { analytics } from './analytics';

interface EngagementEvent {
  type: 'view' | 'share' | 'join' | 'purchase' | 'invite';
  productId: string;
  userId: string;
  teamId?: string;
  metadata?: Record<string, any>;
}

export class EngagementEngine {
  private static instance: EngagementEngine;
  private activeSessions: Map<string, Set<string>> = new Map();

  static getInstance(): EngagementEngine {
    if (!EngagementEngine.instance) {
      EngagementEngine.instance = new EngagementEngine();
    }
    return EngagementEngine.instance;
  }

  async trackEvent(event: EngagementEvent): Promise<void> {
    // Record event
    await analytics.track(event.type, {
      productId: event.productId,
      userId: event.userId,
      teamId: event.teamId,
      ...event.metadata
    });

    // Update real-time counters
    this.updateRealTimeMetrics(event);

    // Process triggers
    await this.processTriggers(event);
  }

  private async updateRealTimeMetrics(event: EngagementEvent): Promise<void> {
    const productRoom = `product:${event.productId}`;
    
    switch (event.type) {
      case 'view':
        this.addToActiveSession(productRoom, event.userId);
        socketService.emit('product:view_count', {
          productId: event.productId,
          count: this.getActiveViewers(productRoom)
        });
        break;

      case 'join':
        socketService.emit('team:member_joined', {
          teamId: event.teamId,
          userId: event.userId
        });
        break;

      case 'purchase':
        socketService.emit('product:purchased', {
          productId: event.productId,
          teamId: event.teamId
        });
        break;
    }
  }

  private async processTriggers(event: EngagementEvent): Promise<void> {
    const triggers = await this.getRelevantTriggers(event);

    for (const trigger of triggers) {
      if (await this.evaluateTrigger(trigger, event)) {
        await this.executeTriggerAction(trigger, event);
      }
    }
  }

  private addToActiveSession(room: string, userId: string): void {
    if (!this.activeSessions.has(room)) {
      this.activeSessions.set(room, new Set());
    }
    this.activeSessions.get(room)?.add(userId);

    // Clean up after inactivity
    setTimeout(() => {
      const viewers = this.activeSessions.get(room);
      if (viewers) {
        viewers.delete(userId);
        if (viewers.size === 0) {
          this.activeSessions.delete(room);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  private getActiveViewers(room: string): number {
    return this.activeSessions.get(room)?.size || 0;
  }

  private async getRelevantTriggers(event: EngagementEvent): Promise<any[]> {
    return api.get('/engagement/triggers', {
      params: {
        eventType: event.type,
        productId: event.productId
      }
    });
  }

  private async evaluateTrigger(trigger: any, event: EngagementEvent): Promise<boolean> {
    const conditions = trigger.conditions;
    
    switch (trigger.type) {
      case 'viewThreshold':
        return this.getActiveViewers(`product:${event.productId}`) >= conditions.threshold;
      
      case 'timeWindow':
        return Date.now() >= new Date(conditions.startTime).getTime() &&
               Date.now() <= new Date(conditions.endTime).getTime();
      
      case 'userSegment':
        const userSegment = await api.get(`/users/${event.userId}/segment`);
        return conditions.segments.includes(userSegment);
      
      default:
        return false;
    }
  }

  private async executeTriggerAction(trigger: any, event: EngagementEvent): Promise<void> {
    switch (trigger.action) {
      case 'notification':
        await notificationService.send({
          userId: event.userId,
          title: trigger.notificationTitle,
          body: trigger.notificationBody,
          data: {
            productId: event.productId,
            teamId: event.teamId
          }
        });
        break;

      case 'priceUpdate':
        await priceOptimization.calculateOptimalPrice(
          event.productId,
          trigger.basePrice,
          { demand: this.getActiveViewers(`product:${event.productId}`) }
        );
        break;

      case 'reward':
        await api.post(`/users/${event.userId}/rewards`, {
          type: trigger.rewardType,
          amount: trigger.rewardAmount
        });
        break;
    }
  }
}

export const engagement = EngagementEngine.getInstance();