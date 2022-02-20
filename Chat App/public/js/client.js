const socket = io('http://localhost:3000');

// Form Elements
const form = document.getElementById('form-group');
const input = form.querySelector('input');

// Message Container
const msgContainer = document.querySelector('.messages');

// Global Variable
let name = "";

// Function: Asks the name from the user and sets it to the global variable 'name'
const askName = () => {
    let input = prompt("Please enter your name");
    if(input) {
        name = input;
        socket.emit('new-user-joined', name);
    }
    else {
        askName();
    }
}

// Function: Appends the message element to the msgContainer
const append = (message, position) => {
    const msgElement = document.createElement('div');
    msgElement.className = "message";
    msgElement.classList.add(position);

    msgElement.innerHTML = message;

    msgContainer.appendChild(msgElement);

    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// Add a 'submit' event listener to the form
form.addEventListener('submit', event => {
    // Prevent the page from reloading
    event.preventDefault();

    const message = input.value;

    // Broadcast the message only if the message is not empty
    if(message !== "") {
        append(`You: ${message}`, 'right');

        socket.emit('send', message);
    }

    // Clear the input field and focus on it
    input.value = "";
    input.focus();
});

socket.on('user-joined', name => {
    append(`<strong>${name}</strong> joined the chat`, 'center');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`<strong>${name}</strong> left the chat`, 'center');
});

// Ask the name of the user as soon as the user visits the website
askName();
