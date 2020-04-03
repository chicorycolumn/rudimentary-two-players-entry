//SERVER SIDE

const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(8001, function() {
  console.log("listening on port 8001");
});

app.use(express.static("public"));

const io = socket(server);

const playersInGame = [];
const playersInLobby = [];

io.on("connection", function(socket) {
  io.to(socket.id).emit("populateLobby", {
    lobbyArr: playersInLobby
  });

  io.to(socket.id).emit("identification", {
    msg: `By the way, your socket id is ${socket.id}`
  });

  socket.on("login", function(data) {
    const newPlayer = {};
    newPlayer.id = socket.id; // also data.id the same
    newPlayer.handle = data.handle;
    console.log(data.handle, "datahandle");

    playersInLobby.push(newPlayer);

    io.to(socket.id).emit("chat", {
      msg: `Hello ${data.handle} and welcome to the game!`
    });

    io.emit("personEntersLobby", { player: data.handle });
  });

  if (playersInGame.length === 0) {
    playersInGame.push(socket.id);
    io.to(socket.id).emit("socket.id", {
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
});
