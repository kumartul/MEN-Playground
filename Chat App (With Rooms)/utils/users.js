const users = [];

// Join user to chat
const userJoin = (id, username, room ) => {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get currrent user
const getCurrentUser = id => {
    return users.find(user => user.id === id);
}

// User leaves chat
const userLeave = id => {
    const index = users.findIndex(user => user.id === id);
    
    return index !== 1 ? users[index] : false;
}

// Get room users
const getRoomUsers = room => {
    return users.filter(user => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }