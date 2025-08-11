import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080', {
  transports: ['websocket'], 
});

export default socket;
