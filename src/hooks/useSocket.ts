import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(API_URL, {
      auth: {
        token,
      },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  return socketRef.current;
};