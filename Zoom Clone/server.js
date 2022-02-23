const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const { v4: uuidv4 } = require('uuid');

const { ExpressPeerServer } = require('peer');

// Create the server
const server = http.Server(app);

const io = require('socket.io')(server);

const peerServer = ExpressPeerServer(server, {
    debug: true
});

const staticPath = path.join(__dirname, 'public');

app.use('/peerjs', peerServer);
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.status(200);
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.status(200);
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message);
        });
    });
});

const port = process.env.PORT || 3000;

// Listen to the server on the specified port
server.listen(port, 'localhost', () => {
    console.log(`Server running at port ${port}`);
});