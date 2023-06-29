const express = require("express");
const app = express();
const dotenv = require("dotenv");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "./config.env" });
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("add-new-user", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieved", data.message);
    }
  });

  socket.on("disconnect", function () {
    Object.keys(onlineUsers).find((userId) => {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    });
  });
});
