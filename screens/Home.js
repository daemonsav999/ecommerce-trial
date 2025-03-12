import React from 'react';
import NavBar from '../components/NavBar';
import HeroBanner from '../components/HeroBanner';
import GroupBuyingSection from '../components/GroupBuyingSection';
import ProductList from '../components/ProductList';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <HeroBanner />
      <GroupBuyingSection />
      <ProductList />
    </div>
  );
};

export default Home;
