import { io, Socket } from 'socket.io-client';
import { api } from '../../../services/api';

interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'product' | 'location';
  metadata?: Record<string, any>;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  type: 'team' | 'merchant' | 'support';
  participants: string[];
  metadata?: Record<string, any>;
}

export class ChatService {
  private static instance: ChatService;
  private socket: Socket | null = null;
  private rooms: Map<string, ChatRoom> = new Map();

  private constructor() {
    this.initializeSocket();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeSocket(): void {
    this.socket = io(`${process.env.REACT_APP_CHAT_SERVER_URL}`, {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.rejoinRooms();
    });

    this.socket.on('message', (message: Message) => {
      this.handleIncomingMessage(message);
    });

    this.socket.on('typing', ({ channelId, userId }) => {
      this.emitLocalEvent('typing', { channelId, userId });
    });

    this.socket.on('error', (error) => {
      console.error('Chat socket error:', error);
      // Implement retry logic
    });
  }

  async joinRoom(roomId: string, type: ChatRoom['type']): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Chat service not connected');
    }

    const room = await api.get(`/chat/rooms/${roomId}`);
    this.rooms.set(roomId, room);

    this.socket.emit('join_room', { roomId });
    await this.loadChatHistory(roomId);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('Chat service not connected');
    }

    const timestamp = new Date();
    const messageId = generateUniqueId();

    // Optimistic update
    this.emitLocalEvent('message', {
      ...message,
      id: messageId,
      timestamp,
      status: 'sending'
    });

    try {
      await this.socket.emit('message', {
        ...message,
        id: messageId,
        timestamp
      });

      // Confirm message sent
      this.emitLocalEvent('message_sent', { messageId });
    } catch (error) {
      this.emitLocalEvent('message_failed', { messageId, error });
    }
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  }

  setTyping(channelId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { channelId, isTyping });
  }

  private async loadChatHistory(channelId: string): Promise<void> {
    try {
      const history = await api.get(`/chat/history/${channelId}`);
      this.emitLocalEvent('history_loaded', {
        channelId,
        messages: history
      });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  private rejoinRooms(): void {
    this.rooms.forEach((room, roomId) => {
      this.socket?.emit('join_room', { roomId });
    });
  }

  private handleIncomingMessage(message: Message): void {
    this.emitLocalEvent('message_received', message);
  }

  private emitLocalEvent(event: string, data: any): void {
    window.dispatchEvent(
      new CustomEvent(`chat:${event}`, { detail: data })
    );
  }
}

export const chatService = ChatService.getInstance();