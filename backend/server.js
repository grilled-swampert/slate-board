// server.js - IMPROVED VERSION
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandler from './sockets/index.js';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import roomManager from './utils/roomManager.js';

dotenv.config();

const app = express();

// CORS configuration (fixed - single call)
const allowedOrigins = [
  'http://localhost:5173',
  'https://slate-board-sigma.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: 'Too many requests from this IP'
});
app.use(limiter);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Connection optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB limit for drawings
  transports: ['websocket', 'polling']
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    activeRooms: roomManager.getRooms().size,
    uptime: process.uptime()
  });
});

// Room info endpoint
app.get('/api/room/:roomCode', (req, res) => {
  const roomInfo = roomManager.getRoomInfo(req.params.roomCode);
  if (roomInfo) {
    res.json(roomInfo);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Initialize socket handlers
socketHandler(io);

// Periodic cleanup of inactive rooms (every hour)
setInterval(() => {
  roomManager.cleanupInactiveRooms(3600000); // 1 hour
}, 3600000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
