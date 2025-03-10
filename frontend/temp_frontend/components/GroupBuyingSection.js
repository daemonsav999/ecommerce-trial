// src/components/GroupBuyingSection.js
import React from 'react';
import WhatsAppShareButton from './WhatsAppShareButton';

const GroupBuyingSection = () => {
  const groupDeals = [
    { 
      id: 1, 
      title: "Deal 1", 
      progress: 60, 
      target: 10,
      price: 99.99,
      originalPrice: 149.99,
      description: "Amazing group deal on premium products"
    },
    { 
      id: 2, 
      title: "Deal 2", 
      progress: 3, 
      target: 5,
      price: 79.99,
      originalPrice: 129.99,
      description: "Limited time group offer"
    },
  ];

  const handleJoinGroup = (dealId) => {
    // TODO: Implement join group logic
    console.log(`Joining group ${dealId}`);
  };

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-brandRed">Group Buying Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded shadow p-4 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-brandRed">
                ${deal.price}
              </span>
              <span className="text-gray-500 line-through">
                ${deal.originalPrice}
              </span>
              <span className="text-green-600 text-sm">
                {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-brandOrange h-3 rounded-full"
                style={{ width: `${(deal.progress / deal.target) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                {deal.progress} of {deal.target} joined
              </p>
              <p className="text-sm text-brandOrange font-semibold">
                {deal.target - deal.progress} spots left!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleJoinGroup(deal.id)}
                className="flex-1 bg-brandRed text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Join Now
              </button>
              <WhatsAppShareButton 
                deal={deal}
                className="bg-[#25D366] text-white p-2 rounded hover:bg-[#128C7E] transition"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupBuyingSection;