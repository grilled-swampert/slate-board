import roomManager from '../utils/roomManager.js';

export default function(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (data) => roomManager.handleJoinRoom(io, socket, data));
    socket.on('stroke', (data) => roomManager.handleStroke(io, socket, data));
    socket.on('cursor', (data) => roomManager.handleCursor(io, socket, data));
    socket.on('clear', (data) => roomManager.handleClear(io, socket, data));
    socket.on('undo', (data) => roomManager.handleUndo(io, socket, data));
    socket.on('disconnect', () => roomManager.handleDisconnect(io, socket));
  });
}
