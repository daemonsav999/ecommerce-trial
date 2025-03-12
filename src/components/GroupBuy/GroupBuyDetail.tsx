import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const GroupBuyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [groupBuy, setGroupBuy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchGroupBuy = async () => {
      try {
        const response = await fetch(`/api/groupbuy/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch group buy details');
        }
        
        const data = await response.json();
        setGroupBuy(data);
      } catch (err) {
        setError('Failed to load group buy details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuy();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const response = await fetch(`/api/groupbuy/join/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join group buy');
      }

      const data = await response.json();
      
      // Add the product to cart with group buy price
      addToCart({
        id: data.product.id,
        name: data.product.name,
        price: data.product.price,
        discountPrice: data.product.discountPrice,
        image: data.product.image,
      });

      navigate('/cart');
    } catch (err) {
      setError('Failed to join group buy');
      console.error('Error:', err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !groupBuy) {
    return <div className="text-center text-red-600 py-8">{error || 'Group buy not found'}</div>;
  }

  const timeLeft = new Date(groupBuy.expiryTime).getTime() - new Date().getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const spotsLeft = groupBuy.minParticipants - groupBuy.currentParticipants;
  const progress = (groupBuy.currentParticipants / groupBuy.minParticipants) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={groupBuy.product.image} 
            alt={groupBuy.product.name}
            className="w-full rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{groupBuy.product.name}</h1>
          
          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-blue-600">
              ${groupBuy.product.discountPrice}
            </span>
            <span className="ml-3 text-lg text-gray-500 line-through">
              ${groupBuy.product.price}
            </span>
            <span className="ml-3 text-green-600">
              {Math.round((1 - groupBuy.product.discountPrice / groupBuy.product.price) * 100)}% OFF
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{groupBuy.currentParticipants} people joined</span>
              <span>{spotsLeft} spots left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {groupBuy.status === 'active' && (
            <div className="mb-6">
              <div className="text-lg">
                {hoursLeft > 0 ? (
                  <span>Ends in {hoursLeft} hours</span>
                ) : (
                  <span className="text-red-600">Ending soon!</span>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={groupBuy.status !== 'active' || joining}
            className={`w-full py-4 px-6 rounded-lg text-lg font-semibold ${
              groupBuy.status === 'active'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
            }`}
          >
            {joining ? 'Joining...' : 
             groupBuy.status === 'active' ? 'Join Group Buy' : 
             groupBuy.status === 'completed' ? 'Group Buy Completed' : 
             'Expired'}
          </button>

          {error && (
            <div className="mt-4 text-red-600 text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-600">{groupBuy.product.description}</p>
      </div>
    </div>
  );
};

export default GroupBuyDetail;