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

module.exports = { userJoin, getCurrentUser }