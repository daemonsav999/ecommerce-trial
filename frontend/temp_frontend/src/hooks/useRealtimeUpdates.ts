import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateGroupBuy } from '@/store/slices/groupBuySlice';

let socket: Socket | null = null;

export const useRealtimeUpdates = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = io('/ws', {
        transports: ['websocket'],
        autoConnect: true
      });

      socket.on('groupBuyUpdate', (data) => {
        dispatch(updateGroupBuy(data));
      });

      socket.on('priceUpdate', (data) => {
        // Handle real-time price updates
      });

      socket.on('stockUpdate', (data) => {
        // Handle real-time stock updates
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch]);

  return socket;
};