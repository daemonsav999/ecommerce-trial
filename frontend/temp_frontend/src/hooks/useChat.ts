import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../features/chat/services/ChatService';
import { useAuth } from './useAuth';

export const useChat = (channelId: string, type: 'team' | 'merchant' | 'support') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const setup = async () => {
      try {
        setLoading(true);
        await chatService.joinRoom(channelId, type);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setup();

    // Cleanup
    return () => {
      // Leave room logic here
    };
  }, [channelId, type]);

  useEffect(() => {
    const handleMessage = (event: CustomEvent) => {
      const message = event.detail;
      setMessages(prev => [message, ...prev]);
    };

    const handleTyping = (event: CustomEvent) => {
      const { userId, isTyping } = event.detail;
      setIsTyping(prev => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    };

    window.addEventListener('chat:message_received', handleMessage as EventListener);
    window.addEventListener('chat:typing', handleTyping as EventListener);

    return () => {
      window.removeEventListener('chat:message_received', handleMessage as EventListener);
      window.removeEventListener('chat:typing', handleTyping as EventListener);
    };
  }, []);

  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text') => {
    try {
      await chatService.sendMessage({
        channelId,
        content,
        type,
        senderId: user.id
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [channelId, user.id]);

  const uploadImage = useCallback(async (file: File) => {
    try {
      return await chatService.uploadImage(file);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    messages,
    isTyping: isTyping.size > 0,
    typingUsers: Array.from(isTyping),
    sendMessage,
    uploadImage,
    loading,
    error
  };
};