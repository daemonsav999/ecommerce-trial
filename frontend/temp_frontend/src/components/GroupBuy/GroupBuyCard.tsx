import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GroupBuyCardProps {
  groupBuy: {
    id: string;
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
      discountPrice: number;
    };
    minParticipants: number;
    currentParticipants: number;
    expiryTime: string;
    status: 'active' | 'completed' | 'expired';
  };
}

const GroupBuyCard: React.FC<GroupBuyCardProps> = ({ groupBuy }) => {
  const navigate = useNavigate();
  const timeLeft = new Date(groupBuy.expiryTime).getTime() - new Date().getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const spotsLeft = groupBuy.minParticipants - groupBuy.currentParticipants;
  const progress = (groupBuy.currentParticipants / groupBuy.minParticipants) * 100;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={groupBuy.product.image} 
          alt={groupBuy.product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {spotsLeft} spots left
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{groupBuy.product.name}</h3>
        
        <div className="flex items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${groupBuy.product.discountPrice}
          </span>
          <span className="ml-2 text-sm text-gray-500 line-through">
            ${groupBuy.product.price}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{groupBuy.currentParticipants} joined</span>
            <span>{groupBuy.minParticipants} needed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {groupBuy.status === 'active' && (
          <div className="text-sm text-gray-600 mb-4">
            {hoursLeft > 0 ? (
              <span>Ends in {hoursLeft} hours</span>
            ) : (
              <span className="text-red-600">Ending soon!</span>
            )}
          </div>
        )}

        <button
          onClick={() => navigate(`/group-buy/${groupBuy.id}`)}
          className={`w-full py-2 px-4 rounded-lg ${
            groupBuy.status === 'active'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
          disabled={groupBuy.status !== 'active'}
        >
          {groupBuy.status === 'active' ? 'Join Group Buy' : 
           groupBuy.status === 'completed' ? 'Group Buy Completed' : 'Expired'}
        </button>
      </div>
    </div>
  );
};

export default GroupBuyCard;