'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAccount } from 'wagmi';
import { useToast } from './useToast';

interface WebSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: (rooms: string[]) => void;
  unsubscribe: (rooms: string[]) => void;
  emit: (event: string, data?: any) => void;
}

export function useWebSocket(): WebSocketHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { address } = useAccount();
  const { info, error } = useToast();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      // Authenticate if user is connected
      if (address) {
        // In a real app, you'd sign a message to prove ownership
        newSocket.emit('authenticate', {
          address,
          signature: 'mock_signature' // Replace with actual signature
        });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        setTimeout(() => {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            connect();
          }
        }, 2000);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setIsConnected(false);
      error('Connection Error', 'Failed to connect to real-time services');
    });

    newSocket.on('authenticated', (data) => {
      if (data.success) {
        console.log('WebSocket authenticated for address:', data.address);
        info('Connected', 'Real-time updates enabled');
      } else {
        console.error('WebSocket authentication failed:', data.error);
        error('Authentication Failed', data.error);
      }
    });

    // Handle real-time events
    newSocket.on('transaction', (data) => {
      console.log('New transaction:', data);
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('newTransaction', { detail: data }));
    });

    newSocket.on('metrics_update', (data) => {
      console.log('Metrics update:', data);
      window.dispatchEvent(new CustomEvent('metricsUpdate', { detail: data }));
    });

    newSocket.on('proposal', (data) => {
      console.log('New proposal:', data);
      window.dispatchEvent(new CustomEvent('newProposal', { detail: data }));
      
      if (data.type === 'CREATED') {
        info('New Proposal', `Proposal "${data.proposal.title}" has been created`);
      }
    });

    newSocket.on('vote', (data) => {
      console.log('New vote:', data);
      window.dispatchEvent(new CustomEvent('newVote', { detail: data }));
    });

    newSocket.on('notification', (data) => {
      console.log('Notification:', data);
      
      // Show toast notification
      const toastType = data.type === 'error' ? 'error' : 
                       data.type === 'warning' ? 'warning' : 
                       data.type === 'success' ? 'success' : 'info';
      
      if (toastType === 'error') {
        error(data.title, data.message);
      } else if (toastType === 'warning') {
        // warning(data.title, data.message);
      } else if (toastType === 'success') {
        // success(data.title, data.message);
      } else {
        info(data.title, data.message);
      }
    });

    newSocket.on('system_announcement', (data) => {
      console.log('System announcement:', data);
      
      const toastType = data.type === 'error' ? 'error' : 
                       data.type === 'warning' ? 'warning' : 'info';
      
      if (toastType === 'error') {
        error('System Alert', data.message);
      } else if (toastType === 'warning') {
        // warning('System Notice', data.message);
      } else {
        info('System Update', data.message);
      }
    });

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 30000);

    newSocket.on('pong', () => {
      // Connection is alive
    });

    setSocket(newSocket);

    return () => {
      clearInterval(heartbeat);
      newSocket.disconnect();
    };
  }, [address, info, error]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const subscribe = useCallback((rooms: string[]) => {
    if (socket?.connected) {
      socket.emit('subscribe', { rooms });
    }
  }, [socket]);

  const unsubscribe = useCallback((rooms: string[]) => {
    if (socket?.connected) {
      socket.emit('unsubscribe', { rooms });
    }
  }, [socket]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    subscribe,
    unsubscribe,
    emit
  };
}

// Hook for listening to specific real-time events
export function useRealTimeEvent<T = any>(eventName: string, callback: (data: T) => void) {
  useEffect(() => {
    const handleEvent = (event: CustomEvent<T>) => {
      callback(event.detail);
    };

    window.addEventListener(eventName as any, handleEvent);
    return () => window.removeEventListener(eventName as any, handleEvent);
  }, [eventName, callback]);
}

// Hook for real-time metrics
export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  
  useRealTimeEvent('metricsUpdate', (data) => {
    setMetrics(data);
  });

  return metrics;
}

// Hook for real-time transactions
export function useRealTimeTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useRealTimeEvent('newTransaction', (data) => {
    setTransactions(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
  });

  return transactions;
}