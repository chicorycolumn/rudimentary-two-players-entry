//make connection
const socket = io.connect("http://localhost:8000");

//Query DOM

const message = document.getElementById("message");
const handle = document.getElementById("handle");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const playerOne = document.getElementById("playerOne");
const playerTwo = document.getElementById("playerTwo");

btn.addEventListener("click", function() {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
    id: socket.id
  });
});

//listen for events

socket.on("gameEntry", function(data) {
  output.innerHTML = data.msg;

  playerOne.innerHTML = `Player One: ${data.playersArr[0]}`;

  playerTwo.innerHTML = `Player Two: ${data.playersArr[1]}`;

  //output.innerHTML += "<p>" + data.msg + "</p>"
});

socket.on("chat", function(data) {
  output.innerHTML += "<p>" + data + "</p>";
  // "<p><strong>" + data.id + ":</strong>" + data.message + "</p>";
});

socket.on("sendMsg", function(data) {
  output.innerHTML += "<p>" + data.msg + "</p>";
  // "<p><strong>" + data.id + ":</strong>" + data.message + "</p>";
});

socket.on("identification", function(data) {
  output.innerHTML += "<p>" + data.msg + "</p>";
  // "<p><strong>" + data.id + ":</strong>" + data.message + "</p>";
});
