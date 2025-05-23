const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend domain in production
    methods: ["GET", "POST"]
  }
});

// In-memory room store
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create Room
  socket.on("createRoom", ({ roomId, username }) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { players: [username] });
      socket.join(roomId);
      io.to(roomId).emit("roomCreated", { roomId, username });
      console.log(`Room ${roomId} created by ${username}`);
    } else {
      socket.emit("error", "Room ID already exists");
    }
  });

  // Join Room
  socket.on("joinRoom", ({ roomId, username }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.players.push(username);
      socket.join(roomId);
      io.to(roomId).emit("playerJoined", { username });
      console.log(`${username} joined room ${roomId}`);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  // Call number
  socket.on("callNumber", ({ roomId, number }) => {
    io.to(roomId).emit("numberCalled", number);
  });

  // Claim prize
  socket.on("claimPrize", ({ roomId, username, prize }) => {
    io.to(roomId).emit("prizeClaimed", { username, prize });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
