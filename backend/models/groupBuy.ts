import { Schema, model, Document } from 'mongoose';

interface IGroupBuy extends Document {
  product: string;
  basePrice: number;
  currentTier: number;
  tiers: Array<{
    participantCount: number;
    discount: number;
  }>;
  participants: Array<{
    user: string;
    joinedAt: Date;
    invitedBy?: string;
  }>;
  timeline: {
    startTime: Date;
    endTime: Date;
    milestones: Array<{
      participantCount: number;
      achievedAt?: Date;
    }>;
  };
  dynamicPricing: {
    enabled: boolean;
    algorithm: string;
    parameters: Record<string, any>;
  };
  gamification: {
    rewards: Array<{
      type: string;
      threshold: number;
      value: number;
    }>;
    teamBonuses: Array<{
      size: number;
      discount: number;
    }>;
  };
}

const groupBuySchema = new Schema<IGroupBuy>({
  // ... schema definition
});

groupBuySchema.methods.calculateCurrentPrice = async function() {
  const participantCount = this.participants.length;
  let currentTier = this.tiers.find(tier => 
    participantCount >= tier.participantCount
  );
  
  if (this.dynamicPricing.enabled) {
    return this.calculateDynamicPrice(currentTier);
  }
  
  return this.basePrice * (1 - currentTier.discount);
};