const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(8000, function() {
  console.log("listening on port 8000");
});

app.use(express.static("public"));

const io = socket(server);

const playersInGame = [];

io.on("connection", function(socket) {
  io.to(socket.id).emit("identification", {
    msg: `I am: ${socket.id}`
  });

  if (playersInGame.length === 0) {
    playersInGame.push(socket.id);
    io.to(socket.id).emit("gameEntry", {
      msg: `Hey ${socket.id} you have entered a game!`,
      playersArr: playersInGame
    });
  } else if (playersInGame.length === 1) {
    playersInGame.push(socket.id);
    io.to(playersInGame[0]).emit("gameEntry", {
      msg: `And now ${socket.id} has joined you in the game!`,
      playersArr: playersInGame
    });
    io.to(socket.id).emit("gameEntry", {
      msg: `Hey ${socket.id} you have entered a game!`,
      playersArr: playersInGame
    });
  } else {
    io.to(socket.id).emit("sendMsg", {
      msg: `I'm sorry ${socket.id}, the game is full.`
    });
  }

  console.log("made socket connection", socket.id);

  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
});
