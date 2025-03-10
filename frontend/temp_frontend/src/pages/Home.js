import React, { useEffect, useState } from 'react';
import { FlashDeals } from '../components/deals/FlashDeals';
import { TeamBuyingSection } from '../components/deals/TeamBuyingSection';
import { ProductGrid } from '../components/products/ProductGrid';
import { CategoryNav } from '../components/navigation/CategoryNav';
import { BannerCarousel } from '../components/ui/BannerCarousel';
import { RecommendationSection } from '../components/products/RecommendationSection';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const { 
    flashDeals, 
    teamDeals, 
    recommendations,
    isLoading,
    error 
  } = useProducts();

  return (
    <div className="space-y-6">
      <BannerCarousel />
      
      <CategoryNav />
      
      {/* Flash Deals Section */}
      <section className="px-4">
        <FlashDeals deals={flashDeals} loading={isLoading} />
      </section>

      {/* Team Buying Section */}
      <section className="px-4">
        <TeamBuyingSection deals={teamDeals} loading={isLoading} />
      </section>

      {/* Recommendations */}
      <section className="px-4">
        <RecommendationSection 
          products={recommendations} 
          loading={isLoading} 
        />
      </section>
    </div>
  );
};

export default Home;