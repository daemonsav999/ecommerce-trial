import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface GroupBuyParticipation {
  id: string;
  product: {
    name: string;
    image: string;
    price: number;
    discountPrice: number;
  };
  status: 'active' | 'completed' | 'expired';
  minParticipants: number;
  currentParticipants: number;
  expiryTime: string;
  joinedAt: string;
}

const UserDashboard: React.FC = () => {
  const [activeParticipations, setActiveParticipations] = useState<GroupBuyParticipation[]>([]);
  const [pastParticipations, setPastParticipations] = useState<GroupBuyParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const response = await fetch('/api/user/group-buys', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch participations');
        }

        const data = await response.json();
        
        setActiveParticipations(data.filter((p: GroupBuyParticipation) => p.status === 'active'));
        setPastParticipations(data.filter((p: GroupBuyParticipation) => p.status !== 'active'));
      } catch (error) {
        console.error('Error fetching participations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for group buy updates
    socket.on('groupBuyUpdated', (updatedGroupBuy) => {
      setActiveParticipations(prev => {
        const index = prev.findIndex(p => p.id === updatedGroupBuy.id);
        if (index === -1) return prev;

        const newActive = [...prev];
        if (updatedGroupBuy.status !== 'active') {
          // Move to past participations if completed or expired
          setPastParticipations(prev => [...prev, updatedGroupBuy]);
          return newActive.filter(p => p.id !== updatedGroupBuy.id);
        }

        newActive[index] = updatedGroupBuy;
        return newActive;
      });
    });

    return () => {
      socket.off('groupBuyUpdated');
    };
  }, [socket]);

  if (loading) {
    return <div className="text-center py-8">Loading your participations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Group Buys</h1>

      {/* Active Participations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Active Group Buys</h2>
        {activeParticipations.length === 0 ? (
          <p className="text-gray-600">No active group buys</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeParticipations.map((participation) => (
              <div key={participation.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={participation.product.image}
                    alt={participation.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{participation.product.name}</h3>
                    <p className="text-green-600">
                      ${participation.product.discountPrice}
                      <span className="text-gray-500 text-sm line-through ml-2">
                        ${participation.product.price}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span>{participation.currentParticipants}/{participation.minParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(participation.currentParticipants / participation.minParticipants) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Expires: {new Date(participation.expiryTime).toLocaleDateString()}
                  </div>
                  {isConnected && (
                    <div className="text-xs text-green-600">
                      ● Live updates enabled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Participations */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Group Buys</h2>
        {pastParticipations.length === 0 ? (
          <p className="text-gray-600">No past group buys</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastParticipations.map((participation) => (
              <div key={participation.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={participation.product.image}
                    alt={participation.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{participation.product.name}</h3>
                    <p className="text-gray-600">
                      Final Price: ${participation.product.discountPrice}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    Status: <span className={`font-semibold ${
                      participation.status === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {participation.status.charAt(0).toUpperCase() + participation.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Joined: {new Date(participation.joinedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Final Participants: {participation.currentParticipants}/{participation.minParticipants}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;