const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Samra Game Server is running successfully!');
});

// المسار المضاف لمنع السيرفر من النوم عبر Uptime Robot
app.get('/ping', (req, res) => {
    res.status(200).send('Alive!');
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // انضمام الأجهزة للغرفة الموحدة
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // استقبال الأوامر من الريموت وبثها للشاشة فوراً
    socket.on('game_action', (data) => {
        if (data && data.room) {
            io.to(data.room).emit('game_update', data);
            console.log(`Action [${data.action}] broadcasted to room: ${data.room}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
