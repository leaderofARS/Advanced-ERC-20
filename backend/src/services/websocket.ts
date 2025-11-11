import { Server as SocketIOServer } from 'socket.io';
import { logger } from '@/utils/logger';
import { blockchainService } from './blockchain';
import { prisma } from '@/config/database';

interface ConnectedUser {
  id: string;
  address?: string;
  rooms: Set<string>;
  lastActivity: Date;
}

class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers = new Map<string, ConnectedUser>();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
    this.startHeartbeat();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      
      // Add user to connected users
      this.connectedUsers.set(socket.id, {
        id: socket.id,
        rooms: new Set(),
        lastActivity: new Date()
      });

      // Handle user authentication
      socket.on('authenticate', async (data) => {
        try {
          const { address, signature } = data;
          
          // Verify signature (implement proper signature verification)
          const isValid = await this.verifySignature(address, signature);
          
          if (isValid) {
            const user = this.connectedUsers.get(socket.id);
            if (user) {
              user.address = address.toLowerCase();
              
              // Join user-specific room
              socket.join(`user:${address.toLowerCase()}`);
              user.rooms.add(`user:${address.toLowerCase()}`);
              
              socket.emit('authenticated', { success: true, address });
              logger.info(`User authenticated: ${address}`);
            }
          } else {
            socket.emit('authenticated', { success: false, error: 'Invalid signature' });
          }
        } catch (error) {
          logger.error('Authentication error:', error);
          socket.emit('authenticated', { success: false, error: 'Authentication failed' });
        }
      });

      // Handle room subscriptions
      socket.on('subscribe', (data) => {
        const { rooms } = data;
        const user = this.connectedUsers.get(socket.id);
        
        if (user && Array.isArray(rooms)) {
          rooms.forEach(room => {
            socket.join(room);
            user.rooms.add(room);
          });
          
          socket.emit('subscribed', { rooms });
          logger.info(`User ${socket.id} subscribed to rooms: ${rooms.join(', ')}`);
        }
      });

      // Handle unsubscribe
      socket.on('unsubscribe', (data) => {
        const { rooms } = data;
        const user = this.connectedUsers.get(socket.id);
        
        if (user && Array.isArray(rooms)) {
          rooms.forEach(room => {
            socket.leave(room);
            user.rooms.delete(room);
          });
          
          socket.emit('unsubscribed', { rooms });
        }
      });

      // Handle ping for connection health
      socket.on('ping', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          user.lastActivity = new Date();
        }
        socket.emit('pong');
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.connectedUsers.delete(socket.id);
      });
    });

    // Listen to blockchain events
    this.setupBlockchainEventHandlers();
  }

  private setupBlockchainEventHandlers() {
    // Transaction events
    blockchainService.on('transaction', (data) => {
      this.broadcastToRoom('transactions', 'transaction', data);
      
      // Send to specific users involved in the transaction
      if (data.from) {
        this.sendToUser(data.from, 'transaction', data);
      }
      if (data.to && data.to !== data.from) {
        this.sendToUser(data.to, 'transaction', data);
      }
    });

    // Metrics updates
    blockchainService.on('metrics', (data) => {
      this.broadcastToRoom('metrics', 'metrics_update', data);
    });

    // Governance events
    blockchainService.on('proposal', (data) => {
      this.broadcastToRoom('governance', 'proposal', data);
    });

    blockchainService.on('vote', (data) => {
      this.broadcastToRoom('governance', 'vote', data);
    });
  }

  private async verifySignature(address: string, signature: string): Promise<boolean> {
    // Implement proper signature verification
    // This is a simplified version - in production, verify the signature properly
    return Boolean(signature && signature.length > 0);
  }

  private startHeartbeat() {
    // Clean up inactive connections every 30 seconds
    setInterval(() => {
      const now = new Date();
      const timeout = 5 * 60 * 1000; // 5 minutes

      for (const [socketId, user] of this.connectedUsers.entries()) {
        if (now.getTime() - user.lastActivity.getTime() > timeout) {
          logger.info(`Removing inactive user: ${socketId}`);
          this.connectedUsers.delete(socketId);
          
          // Disconnect the socket
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            socket.disconnect(true);
          }
        }
      }
    }, 30000);
  }

  // Public methods for sending messages
  public broadcastToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }

  public sendToUser(address: string, event: string, data: any) {
    this.io.to(`user:${address.toLowerCase()}`).emit(event, data);
  }

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  public sendNotification(address: string, notification: any) {
    this.sendToUser(address, 'notification', notification);
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getConnectedUsers(): ConnectedUser[] {
    return Array.from(this.connectedUsers.values());
  }

  // Send real-time price updates
  public sendPriceUpdate(priceData: any) {
    this.broadcastToRoom('price', 'price_update', priceData);
  }

  // Send system announcements
  public sendSystemAnnouncement(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.broadcast('system_announcement', {
      message,
      type,
      timestamp: new Date().toISOString()
    });
  }
}

let webSocketService: WebSocketService;

export function initializeWebSocket(io: SocketIOServer) {
  webSocketService = new WebSocketService(io);
  logger.info('WebSocket service initialized');
  return webSocketService;
}

export function getWebSocketService(): WebSocketService {
  if (!webSocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return webSocketService;
}