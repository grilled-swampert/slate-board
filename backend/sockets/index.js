// index.js - ENHANCED WITH ERROR HANDLING
import roomManager from '../utils/roomManager.js';

export default function(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Error handling wrapper
    const handleEvent = (handler) => (data) => {
      try {
        handler(io, socket, data);
      } catch (error) {
        console.error(`Error handling event:`, error);
        socket.emit('error', { message: 'An error occurred processing your request' });
      }
    };

    socket.on('join-room', handleEvent(roomManager.handleJoinRoom));
    socket.on('stroke', handleEvent(roomManager.handleStroke));
    socket.on('cursor', handleEvent(roomManager.handleCursor));
    socket.on('clear', handleEvent(roomManager.handleClear));
    socket.on('undo', handleEvent(roomManager.handleUndo));
    
    socket.on('disconnect', () => {
      try {
        roomManager.handleDisconnect(io, socket);
      } catch (error) {
        console.error(`Error handling disconnect:`, error);
      }
    });

    // Ping/pong for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Monitor connection metrics
  io.engine.on('connection_error', (err) => {
    console.error('Connection error:', err);
  });
}
