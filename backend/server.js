import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandler from './sockets/index.js';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
});

const app = express();
app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'https://slate-board-sigma.vercel.app'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(limiter);

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketHandler(io); 

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
