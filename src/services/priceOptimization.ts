import { api } from './api';

interface PriceFactors {
  demand: number;          // Current demand score
  competition: number;     // Competitive price index
  inventory: number;       // Current inventory levels
  seasonality: number;     // Seasonal demand factor
  userSegment: number;     // User price sensitivity
  teamSize: number;        // Number of team members
  timeLeft: number;        // Time remaining for deal
}

export class PriceOptimizationEngine {
  private static instance: PriceOptimizationEngine;

  static getInstance(): PriceOptimizationEngine {
    if (!PriceOptimizationEngine.instance) {
      PriceOptimizationEngine.instance = new PriceOptimizationEngine();
    }
    return PriceOptimizationEngine.instance;
  }

  async calculateOptimalPrice(
    productId: string,
    basePrice: number,
    factors: Partial<PriceFactors>
  ): Promise<number> {
    // Get historical data and market insights
    const [history, market] = await Promise.all([
      this.getHistoricalData(productId),
      this.getMarketData(productId)
    ]);

    // Calculate base discount based on team size
    let discount = this.calculateBaseDiscount(factors.teamSize || 1);

    // Adjust for market conditions
    discount = this.adjustForMarket(discount, market);

    // Apply time pressure
    if (factors.timeLeft) {
      discount = this.applyTimePressure(discount, factors.timeLeft);
    }

    // Ensure price remains profitable
    const minimumPrice = await this.getMinimumViablePrice(productId);
    const optimalPrice = Math.max(
      basePrice * (1 - discount),
      minimumPrice
    );

    return this.roundPrice(optimalPrice);
  }

  private calculateBaseDiscount(teamSize: number): number {
    const baseDiscount = 0.1; // 10% base discount
    const teamBonus = Math.min(teamSize * 0.05, 0.3); // Up to 30% additional discount
    return baseDiscount + teamBonus;
  }

  private adjustForMarket(discount: number, marketData: any): number {
    if (marketData.competitivePressure > 0.7) {
      return discount * 1.2; // Increase discount by 20%
    }
    if (marketData.demandScore > 0.8) {
      return discount * 0.9; // Reduce discount by 10%
    }
    return discount;
  }

  private applyTimePressure(discount: number, timeLeft: number): number {
    const hoursFactor = timeLeft / (24 * 60 * 60 * 1000); // Convert to hours
    if (hoursFactor < 2) {
      return discount * 1.3; // Increase discount by 30% in last 2 hours
    }
    if (hoursFactor < 6) {
      return discount * 1.15; // Increase discount by 15% in last 6 hours
    }
    return discount;
  }

  private async getMinimumViablePrice(productId: string): Promise<number> {
    const { cost, overhead } = await api.get(`/products/${productId}/costs`);
    return cost + overhead;
  }

  private roundPrice(price: number): number {
    // Round to psychologically attractive price points
    const base = Math.floor(price);
    if (base >= 100) {
      return base - 1;
    }
    return Math.floor(price * 10) / 10 - 0.1;
  }
}

export const priceOptimization = PriceOptimizationEngine.getInstance();