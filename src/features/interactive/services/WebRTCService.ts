import { io, Socket } from 'socket.io-client';

export class WebRTCService {
  private static instance: WebRTCService;
  private peerConnection: RTCPeerConnection | null = null;
  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;

  private constructor() {
    this.initializeSocket();
  }

  static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }

  private initializeSocket(): void {
    this.socket = io(`${process.env.REACT_APP_WEBRTC_SERVER_URL}`, {
      transports: ['websocket'],
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      await this.handleOffer(offer);
    });

    this.socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      await this.handleAnswer(answer);
    });

    this.socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      await this.handleIceCandidate(candidate);
    });
  }

  async startBroadcast(sessionId: string): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add TURN servers for production
        ]
      });

      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      this.setupPeerConnectionListeners(sessionId);

      return this.localStream;
    } catch (error) {
      console.error('Failed to start broadcast:', error);
      throw error;
    }
  }

  async joinBroadcast(sessionId: string): Promise<void> {
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      this.setupPeerConnectionListeners(sessionId);

      // Signal ready to receive offer
      this.socket?.emit('viewer-ready', { sessionId });
    } catch (error) {
      console.error('Failed to join broadcast:', error);
      throw error;
    }
  }

  private setupPeerConnectionListeners(sessionId: string): void {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('ice-candidate', {
          sessionId,
          candidate: event.candidate
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.emitLocalEvent('remote-stream', event.streams[0]);
    };

    this.peerConnection.onconnectionstatechange = () => {
      this.emitLocalEvent('connection-state', this.peerConnection?.connectionState);
    };
  }

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.socket?.emit('answer', { sessionId: this.sessionId, answer });
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) return;

    await this.peerConnection.addIceCan