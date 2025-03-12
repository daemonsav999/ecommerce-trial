import { api } from '../../services/api';

interface RewardRule {
  type: 'teamFormation' | 'inviteSuccess' | 'dailyShare';
  points: number;
  conditions: {
    minMembers?: number;
    timeFrame?: number;
    platform?: string[];
  };
}

interface RewardEvent {
  userId: string;
  type: RewardRule['type'];
  metadata: {
    groupBuyId?: string;
    productId?: string;
    platform?: string;
    invitedUser?: string;
  };
  timestamp: Date;
}

export class RewardsEngine {
  private static instance: RewardsEngine;
  private rewardRules: RewardRule[] = [
    {
      type: 'teamFormation',
      points: 100,
      conditions: {
        minMembers: 3,
        timeFrame: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
    {
      type: 'inviteSuccess',
      points: 50,
      conditions: {
        platform: ['whatsapp', 'telegram', 'messenger'],
      },
    },
    {
      type: 'dailyShare',
      points: 10,
      conditions: {
        timeFrame: 24 * 60 * 60 * 1000,
      },
    },
  ];

  static getInstance(): RewardsEngine {
    if (!RewardsEngine.instance) {
      RewardsEngine.instance = new RewardsEngine();
    }
    return RewardsEngine.instance;
  }

  async processEvent(event: RewardEvent): Promise<number> {
    const rule = this.rewardRules.find(r => r.type === event.type);
    if (!rule) return 0;

    const isValid = await this.validateEvent(event, rule);
    if (!isValid) return 0;

    const points = await this.calculatePoints(event, rule);
    await this.awardPoints(event.userId, points);

    return points;
  }

  private async validateEvent(event: RewardEvent, rule: RewardRule): Promise<boolean> {
    switch (event.type) {
      case 'teamFormation':
        return this.validateTeamFormation(event, rule);
      case 'inviteSuccess':
        return this.validateInvite(event, rule);
      case 'dailyShare':
        return this.validateDailyShare(event, rule);
      default:
        return false;
    }
  }

  private async calculatePoints(event: RewardEvent, rule: RewardRule): Promise<number> {
    let multiplier = 1;

    // Apply multipliers based on user's history and behavior
    const userStats = await api.get(`/users/${event.userId}/stats`);
    
    if (userStats.successfulTeams > 5) multiplier *= 1.2;
    if (userStats.inviteConversionRate > 0.5) multiplier *= 1.3;
    
    return Math.round(rule.points * multiplier);
  }

  private async awardPoints(userId: string, points: number): Promise<void> {
    await api.post(`/users/${userId}/rewards`, { points });
  }

  // Validation methods
  private async validateTeamFormation(event: RewardEvent, rule: RewardRule): Promise<boolean> {
    const team = await api.get(`/teams/${event.metadata.groupBuyId}`);
    return (
      team.members.length >= (rule.conditions.minMembers || 0) &&
      (new Date().getTime() - team.createdAt.getTime()) <= (rule.conditions.timeFrame || Infinity)
    );
  }

  private async validateInvite(event: RewardEvent, rule: RewardRule): Promise<boolean> {
    const platform = event.metadata.platform;
    return rule.conditions.platform?.includes(platform || '') || false;
  }

  private async validateDailyShare(event: RewardEvent, rule: RewardRule): Promise<boolean> {
    const lastShare = await api.get(`/users/${event.userId}/last-share`);
    return (
      !lastShare ||
      (event.timestamp.getTime() - new Date(lastShare.timestamp).getTime()) >= (rule.conditions.timeFrame || 0)
    );
  }
}

export const rewardsEngine = RewardsEngine.getInstance();