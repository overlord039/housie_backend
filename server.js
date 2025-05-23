const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend from any domain
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    io.to(roomId).emit("playerJoined", { username });
  });

  socket.on("callNumber", ({ roomId, number }) => {
    console.log(`Number called in ${roomId}: ${number}`);
    io.to(roomId).emit("numberCalled", number);
  });

  socket.on("claimPrize", ({ roomId, username, prizeType }) => {
    io.to(roomId).emit("prizeClaimed", { username, prizeType });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
