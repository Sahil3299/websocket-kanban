import { io } from 'socket.io-client';
import { getToken } from './auth';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    initializeSocket(token);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};