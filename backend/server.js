const express = require('express');
const cors = require('cors');
const http = require("http");

require('dotenv').config();

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const followRoutes = require('./routes/follow');
const messageRoutes = require("./routes/messages");
const rehabilitationRoutes = require("./routes/rehabilitation");

const path = require('path');

const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }

});

app.set("io", io);

io.on("connection", (socket) => {

    const userId =
        Number(socket.handshake.auth.userId);

    if (userId) {

        const roomName =
            `user_${userId}`;

        socket.join(roomName);

    }

});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/follow', followRoutes);
app.use("/messages", messageRoutes);
app.use("/rehabilitation", rehabilitationRoutes );

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});