const messageIcon = document.getElementById("message-icon");
const messageContainer = document.querySelector(".chat-container");
const messageCrossBtn = document.querySelector(".fa-circle-xmark");
messageIcon.addEventListener("click", () => {
  messageContainer.style.display = "block";
  messageIcon.style.display = "none";
});

messageCrossBtn.addEventListener("click", () => {
  messageContainer.style.display = "none";
  messageIcon.style.display = "block";
});

const socket = io();

setInterval(() => {
  const start = Date.now();

  socket.emit("ping", () => {
    const duration = Date.now() - start;
    // console.log(duration);
  });
}, 1000);

const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const startButton = document.getElementById("start-button");
const endButton = document.getElementById("end-button");
const messageSendBtn = document.getElementById("message-send-btn");
messageSendBtn.disabled = true;

messageInput.disabled = true;

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("user:message", message);
    messageInput.value = "";
  }
});

socket.on("admin:message", (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = `Dev.Reniel: ${message}`;
  messageElement.classList.add("admin-message");
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("user:message", (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message}`;
  messageElement.classList.add("user-message");
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function startChat() {
  startButton.disabled = true;
  endButton.disabled = false;
  socket.emit("user:message", "Chat started");
  messageSendBtn.disabled = false;
  messageInput.disabled = false;
}

function endChat() {
  startButton.disabled = false;
  endButton.disabled = true;
  socket.emit("user:message", "Chat ended");
  socket.disconnect();
  messageSendBtn.disabled = true;
  messageInput.disabled = true;
}
