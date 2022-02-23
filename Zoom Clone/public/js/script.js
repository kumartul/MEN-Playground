const socket = io();

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');

let myVideoStream;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

// Function: Adds the video stream to the video element
const addVideoStream = (video, stream) => {
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}

// Function: Connects new user to the room
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);

    const video = document.createElement('video');
    
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}

navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
}).then(stream => {
    myVideoStream = stream;

    addVideoStream(myVideo, myVideoStream);

    peer.on('call', call => {
        call.answer(myVideoStream);

        const video = document.createElement('video');

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-connected', userId => {
    connectToNewUser(userId, myVideoStream);
});

// Chat Window
const chatWindow = document.querySelector('.main__chat_window');

// Messages Container
const messagesContainer = document.querySelector('.messages');

// Input field
const message = document.getElementById('chat_message');

// Attach a 'keydown' event handler to the input field
message.addEventListener('keydown', event => {
    if(event.keyCode === 13 && message.value !== '') {
        socket.emit('message', message.value);

        message.value = '';
        message.focus();
    }
});

socket.on('createMessage', message => {
    const li = document.createElement('li');
    li.innerHTML = message;

    messagesContainer.appendChild(li);

    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Function: Sets the button to mute
const setMuteButton = () => {
    const button = document.querySelector('.main__mute_button');

    button.innerHTML = 
    `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `;

    button.style.color = 'white';
}

// Function: Sets the button to unmute
const setUnmuteButton = () => {
    const button = document.querySelector('.main__mute_button');

    button.innerHTML =
        `
    <i class="fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `;

    button.style.color = 'red';
}

// Function: Mutes and unmutes the video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

// Function: Sets the button to play video
const setPlayVideo = () => {
    const button = document.querySelector('.main__video_button');

    button.innerHTML =
    `
        <i class="fas fa-video-slash"></i>
        <span>Play Video</span>
    `;

    button.style.color = 'red';
}

// Function: Sets the button to stop video
const setStopVideo = () => {
    const button = document.querySelector('.main__video_button');

    button.innerHTML =
        `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `;

    button.style.color = 'white';
}

// Function: Enables and disables the video
const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        setStopVideo();
    }
}