import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { configureSocket } from './socket/index.js';

const port = process.env.PORT || 5050;
await connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});

configureSocket(io);
app.set('io', io);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Change PORT in server/.env or stop the process using that port.`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, () => {
  console.log(`API running on port ${port}`);
});
