const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Samra Game Server is Running! 🟢');
});

io.on('connection', (socket) => {
  // عند انضمام الجوال أو الشاشة لغرفة معينة
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  // إعادة توجيه الأوامر من الجوال للشاشة فوراً
  socket.on('game_action', (data) => {
    io.to(data.roomId).emit('game_update', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
