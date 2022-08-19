const socket = io('http://localhost:4000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

//You connect
appendMessage('Pridruzil si se');
socket.emit('new-user', name);

//Messege from other user
socket.on('chat-message', data => {
	appendMessage(`Sogovornik: ${data.message}`);
});
//Other user connect
socket.on('user-connected', name => {
	appendMessage('Sogovornik se je povezal');
});
//Other user disconnet
socket.on('user-disconnected', name => {
	appendMessage('Sogovornik je odšel');
});

//You send new messege
messageForm.addEventListener('submit', e => {
	e.preventDefault();
	const message = messageInput.value;
	appendMessage(`Ti: ${message}`);
	socket.emit('send-chat-message', message);
	messageInput.value = '';
});
//Display other messeges
function appendMessage(message) {
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	messageContainer.append(messageElement);
}