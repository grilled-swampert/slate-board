// roomManager.js - FIXED VERSION
const rooms = new Map();

const handleJoinRoom = (io, socket, { roomCode, user }) => {
  if (!roomCode || !user) {
    socket.emit('error', { message: 'Invalid room code or user data' });
    return;
  }

  socket.join(roomCode);

  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, { 
      users: [], 
      strokes: [],
      createdAt: Date.now(),
      lastActivity: Date.now()
    });
  }

  const room = rooms.get(roomCode);
  const existingUserIndex = room.users.findIndex(u => u.id === user.id);
  user.socketId = socket.id;
  user.joinedAt = Date.now();

  if (existingUserIndex >= 0) {
    room.users[existingUserIndex] = user;
  } else {
    room.users.push(user);
  }

  room.lastActivity = Date.now();

  // Send existing state to new user
  socket.emit('existing-strokes', { strokes: room.strokes });
  socket.emit('joined-room', { roomCode, users: room.users });
  
  // Notify all users in room
  io.to(roomCode).emit('users-updated', { users: room.users });
  
  console.log(`User ${user.id} joined room ${roomCode}. Total users: ${room.users.length}`);
};

const handleStroke = (io, socket, { roomCode, stroke }) => {
  const room = rooms.get(roomCode);
  if (room) {
    // Add timestamp and user info to stroke
    stroke.timestamp = Date.now();
    room.strokes.push(stroke);
    room.lastActivity = Date.now();
    
    // Broadcast to others in room (not sender)
    socket.to(roomCode).emit('stroke', { stroke });
  } else {
    socket.emit('error', { message: 'Room not found' });
  }
};

const handleCursor = (io, socket, { roomCode, cursorData }) => {
  // Add timestamp for cursor throttling on client
  cursorData.timestamp = Date.now();
  socket.to(roomCode).emit('cursor', { cursorData });
};

const handleClear = (io, socket, { roomCode, userId }) => {
  const room = rooms.get(roomCode);
  if (room) {
    room.strokes = [];
    room.lastActivity = Date.now();
    
    // Emit to entire room including sender
    io.to(roomCode).emit('clear', { clearedBy: userId });
    console.log(`Room ${roomCode} cleared by user ${userId}`);
  }
};

const handleUndo = (io, socket, { roomCode, userId }) => {
  const room = rooms.get(roomCode);
  if (room && room.strokes.length > 0) {
    const removedStroke = room.strokes.pop();
    room.lastActivity = Date.now();
    
    io.to(roomCode).emit('undo', { removedStroke, undoneBy: userId });
    console.log(`Undo in room ${roomCode} by user ${userId}`);
  }
};

const handleDisconnect = (io, socket) => {
  console.log(`User disconnected: ${socket.id}`);
  
  for (const [roomCode, room] of rooms.entries()) {
    const disconnectedUser = room.users.find(user => user.socketId === socket.id);
    
    if (disconnectedUser) {
      room.users = room.users.filter(user => user.socketId !== socket.id);
      io.to(roomCode).emit('users-updated', { users: room.users });
      console.log(`User ${disconnectedUser.id} left room ${roomCode}`);

      // Clean up empty rooms
      if (room.users.length === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted (empty)`);
      }
      break; // Exit after finding the room
    }
  }
};

// NEW: Room management utilities
const getRoomInfo = (roomCode) => {
  const room = rooms.get(roomCode);
  if (!room) return null;
  
  return {
    roomCode,
    userCount: room.users.length,
    strokeCount: room.strokes.length,
    createdAt: room.createdAt,
    lastActivity: room.lastActivity
  };
};

const cleanupInactiveRooms = (maxInactiveMs = 3600000) => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [roomCode, room] of rooms.entries()) {
    if (now - room.lastActivity > maxInactiveMs) {
      rooms.delete(roomCode);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} inactive rooms`);
  }
};

export default {
  handleJoinRoom,
  handleStroke,
  handleCursor,
  handleClear,
  handleUndo,
  handleDisconnect,
  getRoomInfo,
  cleanupInactiveRooms,
  getRooms: () => rooms
};
