const port = 3000;

const io = require('socket.io')(port, {
    cors: {
        origin: '*'
    }
});

// Connected users
const users = {}

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;

        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log("sent...");
        socket.broadcast.emit('receive', { 
            message, 
            name: users[socket.id] 
        });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        
        delete users[socket.id];
    });
});