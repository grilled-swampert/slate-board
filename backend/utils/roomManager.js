const rooms = new Map();

const handleJoinRoom = (io, socket, { roomCode, user }) => {
  socket.join(roomCode);

  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, { users: [], strokes: [] });
  }

  const room = rooms.get(roomCode);
  const existingUserIndex = room.users.findIndex(u => u.id === user.id);

  user.socketId = socket.id;

  if (existingUserIndex >= 0) {
    room.users[existingUserIndex] = user;
  } else {
    room.users.push(user);
  }

  socket.emit('existing-strokes', { strokes: room.strokes });
  io.to(roomCode).emit('users-updated', { users: room.users });
  socket.emit('joined-room', { roomCode, users: room.users });
};

const handleStroke = (io, socket, { roomCode, stroke }) => {
  const room = rooms.get(roomCode);
  if (room) {
    room.strokes.push(stroke);
    socket.to(roomCode).emit('stroke', { stroke });
  }
};

const handleCursor = (io, socket, { roomCode, cursorData }) => {
  socket.to(roomCode).emit('cursor', { cursorData });
};

const handleClear = (io, socket, { roomCode }) => {
  const room = rooms.get(roomCode);
  if (room) {
    room.strokes = [];
    io.to(roomCode).emit('clear');
  }
};

const handleUndo = (io, socket, { roomCode }) => {
  const room = rooms.get(roomCode);
  if (room) {
    room.strokes.pop();
    io.to(roomCode).emit('undo');
  }
};

const handleDisconnect = (io, socket) => {
  for (const [roomCode, room] of rooms.entries()) {
    const oldLength = room.users.length;
    room.users = room.users.filter(user => user.socketId !== socket.id);
    if (room.users.length !== oldLength) {
      io.to(roomCode).emit('users-updated', { users: room.users });
    }
    if (room.users.length === 0) {
      rooms.delete(roomCode);
    }
  }
};

export default {
  handleJoinRoom,
  handleStroke,
  handleCursor,
  handleClear,
  handleUndo,
  handleDisconnect,
};
