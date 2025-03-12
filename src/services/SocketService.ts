import { io, Socket } from 'socket.io-client';
import { Config } from 'react-native-config';
import { EventEmitter } from 'events';

class SocketService extends EventEmitter {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    super();
    this.setupSocket();
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setupSocket() {
    this.socket = io(Config.API_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', this.handleConnect.bind(this));
    this.socket.on('disconnect', this.handleDisconnect.bind(this));
    this.socket.on('error', this.handleError.bind(this));
    this.socket.on('reconnect_attempt', this.handleReconnectAttempt.bind(this));
    this.socket.on('reconnect_failed', this.handleReconnectFailed.bind(this));
  }

  connect(token: string) {
    if (!this.socket) return;

    this.socket.auth = { token };
    this.socket.connect();
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
  }

  emit(event: string, data: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Message queued.');
      return;
    }

    this.socket.emit(event, data);
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) return;

    this.socket.on(event, callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) return;

    this.socket.off(event, callback);
  }

  private handleConnect() {
    console.log('Socket connected');
    this.reconnectAttempts = 0;
    this.emit('client_ready', { timestamp: new Date().toISOString() });
  }

  private handleDisconnect(reason: string) {
    console.log('Socket disconnected:', reason);
    this.emit('disconnect_reason', { reason });
  }

  private handleError(error: Error) {
    console.error('Socket error:', error);
    this.emit('client_error', { error: error.message });
  }

  private handleReconnectAttempt(attempt: number) {
    this.reconnectAttempts = attempt;
    console.log(`Reconnection attempt ${attempt} of ${this.maxReconnectAttempts}`);
  }

  private handleReconnectFailed() {
    console.error('Failed to reconnect after maximum attempts');
    this.emit('reconnect_failed', {
      attempts: this.reconnectAttempts,
      timestamp: new Date().toISOString()
    });
  }
}

export const socketService = SocketService.getInstance();