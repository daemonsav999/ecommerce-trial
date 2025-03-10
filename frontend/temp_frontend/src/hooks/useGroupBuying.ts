import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useSocket } from './useSocket';

export const useGroupBuying = (groupId?: string) => {
  const socket = useSocket();

  const { data: groupDetails, refetch } = useQuery({
    queryKey: ['groupDetails', groupId],
    queryFn: () => api.get(`/groups/${groupId}`),
    enabled: !!groupId,
  });

  const joinGroupMutation = useMutation({
    mutationFn: (data: {
      orderId: string;
      shippingInfo: any;
      paymentMethod: any;
    }) => api.post(`/groups/${groupId}/join`, data),
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: {
      productId: string;
      orderId: string;
      shippingInfo: any;
      paymentMethod: any;
    }) => api.post('/groups', data),
  });

  // Listen for real-time updates
  useEffect(() => {
    if (!groupId || !socket) return;

    socket.emit('join_group', groupId);

    socket.on('group_updated', (data) => {
      refetch();
    });

    return () => {
      socket.emit('leave_group', groupId);
      socket.off('group_updated');
    };
  }, [groupId, socket]);

  return {
    groupDetails,
    joinGroup: joinGroupMutation.mutateAsync,
    createGroup: createGroupMutation.mutateAsync,
  };
};