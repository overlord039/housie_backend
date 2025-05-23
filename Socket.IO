const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    io.to(roomId).emit("playerJoined", { username });
  });

  socket.on("callNumber", ({ roomId, number }) => {
    io.to(roomId).emit("numberCalled", number);
  });
});
