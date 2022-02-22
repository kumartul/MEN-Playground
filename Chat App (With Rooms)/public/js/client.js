const form = document.getElementById('form-group');
const chatContainer = document.querySelector('.messages');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

socket.emit('join-room', { username, room });

const outputRoom = room => {
    const roomElement = document.querySelector('.room');
    roomElement.innerHTML = room;
}

const outputUsers = users => {
    const usersContainer = document.querySelector('.users');

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user';
        userElement.innerHTML = user.username;
        usersContainer.appendChild(userElement);
    });
}

// Get room users
socket.on('roomUsers', ({ room, users }) => {
    outputRoom(room);
    outputUsers(users);
});

// Output message to DOM
const outputMessage = data => {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message', 'right');
    msgElement.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;

    chatContainer.appendChild(msgElement);
}

// Message from server
socket.on('message', data => {
    outputMessage(data);

    // Scroll down
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Add a 'submit' event listener to the form
form.addEventListener('submit', event => {
    // Prevent the page from reloading
    event.preventDefault();

    const message = form.querySelector('input').value;

    // Broadcast the message only if the message is not empty
    if(message !== "") {
        socket.emit('chatMessage', { username, message });
    }

    // Clear the input field and focus on it
    form.querySelector('input').value = "";
    form.querySelector('input').focus();
});