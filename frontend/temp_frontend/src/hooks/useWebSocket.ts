import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '@/config';

export const useWebSocket = () => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(WEBSOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return socket.current;
};