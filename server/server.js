// server/server.js (or server/index.js)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import initializeFirebaseAdmin from './config/firebaseAdmin.js';
import { handleSocketConnections } from './socket/socketHandler.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import groupRoutes from './routes/group.routes.js';
import applicationRoutes from './routes/application.routes.js';
import chatRoutes from './routes/chat.routes.js';
import certificateRoutes from './routes/certificate.routes.js';

// --- Init and DB ---
dotenv.config();
await connectDB();
initializeFirebaseAdmin();

const app = express();

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check
app.get('/', (_req, res) => res.send('HackMate API is running...'));

// --- Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
});
handleSocketConnections(io);

// --- Start ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
