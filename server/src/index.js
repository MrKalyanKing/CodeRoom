import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './Config/db.js';
import roomRoutes from './modules/Room/routes/room.routes.js';
import authRoutes from './modules/Auth/routes/auth.routes.js';
import historyRoutes from './modules/History/routes/history.routes.js';
import { registerSocket } from './sockethandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  }
});

const port = process.env.PORT || 4600;

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

io.on('connection', (socket) => {
  registerSocket(io, socket);
});

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
