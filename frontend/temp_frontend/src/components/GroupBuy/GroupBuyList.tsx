import React, { useState, useEffect } from 'react';
import GroupBuyCard from './GroupBuyCard';

const GroupBuyList: React.FC = () => {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const response = await fetch('/api/groupbuy', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch group buys');
        }
        
        const data = await response.json();
        setGroupBuys(data);
      } catch (err) {
        setError('Failed to load group buys');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading group buys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Active Group Buys</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupBuys.map((groupBuy) => (
          <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />
        ))}
      </div>
    </div>
  );
};

export default GroupBuyList;