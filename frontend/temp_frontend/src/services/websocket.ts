import io, { Socket } from 'socket.io-client';
import { store } from '../store';
import { addMessage } from '../store/slices/chatSlice';
import { updateGroupBuy } from '../store/slices/groupBuySlice';
import { updateLiveStream } from '../store/slices/liveStreamSlice';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, token: string) {
    this.socket = io(process.env.EXPO_PUBLIC_WS_URL!, {
      auth: { token },
      query: { userId },
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.handleDisconnect();
    });

    // Chat events
    this.socket.on('chat:message', (message) => {
      store.dispatch(addMessage(message));
    });

    // Group buy events
    this.socket.on('groupBuy:update', (data) => {
      store.dispatch(updateGroupBuy(data));
    });

    // Live stream events
    this.socket.on('livestream:update', (data) => {
      store.dispatch(updateLiveStream(data));
    });
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.socket?.connect();
      }, Math.min(1000 * this.reconnectAttempts, 5000));
    }
  }

  // Methods for sending messages
  sendChatMessage(roomId: string, message: string) {
    this.socket?.emit('chat:message', { roomId, message });
  }

  joinGroupBuyRoom(groupBuyId: string) {
    this.socket?.emit('groupBuy:join', { groupBuyId });
  }

  joinLiveStream(streamId: string) {
    this.socket?.emit('livestream:join', { streamId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;