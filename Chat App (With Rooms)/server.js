const path = require('path');
const http = require('http');

const express = require('express');
const app = express();

const socketio = require('socket.io');

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const server = http.createServer(app);

const io = socketio(server);

// Run when a client connects
io.on('connection', socket => {
    socket.on('join-room', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', {
            username: 'Bot',
            message: 'Welcome to SockeTalk'
        });

        // Broadcast when a client connects
        socket.broadcast.to(user.room).emit('message', {
            username: 'Bot',
            message: `${username} has joined the chat`
        });

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Broadcast when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', {
                username: 'Bot',
                message: `${user.username} has left the chat`
            });

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

    // Listen for messages from the client
    socket.on('chatMessage', data => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', {
            username: data.username,
            message: data.message
        });
    });
});

const staticPath = path.join(__dirname, 'public');

// Set static folder
app.use(express.static(staticPath));

const port = process.env.PORT || 3000;

server.listen(port, 'localhost', () => {
    console.log(`Server is running on port ${port}`);
});