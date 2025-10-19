import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = parseInt(process.env.PORT || '3004');

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'chat-service' });
});

server.listen(PORT, () => {
  console.log(`Chat service on port ${PORT}`);
});
