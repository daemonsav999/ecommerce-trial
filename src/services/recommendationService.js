import { Document } from 'mongoose';
import { UserProfile } from '../models/userProfile';
import { Product } from '../models/product';

interface RecommendationScore {
  productId: string;
  score: number;
}

class RecommendationEngine {
  private async calculateUserAffinityScore(
    userId: string,
    productId: string
  ): Promise<number> {
    const userProfile = await UserProfile.findOne({ user: userId })
      .populate('purchaseHistory')
      .populate('viewHistory');
    
    return this.processUserBehavior(userProfile, productId);
  }

  private async getSimilarProducts(productId: string): Promise<Product[]> {
    const product = await Product.findById(productId);
    return await Product.find({
      category: product.category,
      _id: { $ne: productId }
    }).limit(10);
  }

  async getPersonalizedRecommendations(userId: string): Promise<Product[]> {
    const userProfile = await UserProfile.findOne({ user: userId });
    const recentViews = await this.getRecentUserViews(userId);
    const similarProducts = await this.processCollaborativeFiltering(userId);
    
    return this.rankProducts(userProfile, [...recentViews, ...similarProducts]);
  }
}