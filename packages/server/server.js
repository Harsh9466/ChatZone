const mongoose = require("mongoose");
const socket = require("socket.io");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT REJECTION 😑. Shutting down...");
  // console.log(`${err.name}: ${err.message}`);
  console.log(`${err.stack}`);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 4000;

const DB = process.env.DATABASE;

// const LocalDB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log(`App connected with ${res.connection.name} database`);
  });

const server = app.listen(port, () => {
  console.log(
    `App running in ${app.get("env")} mode on ${`http://127.0.0.1:${port}`}`
  );
});

const io = socket(server, {
  cors: {
    origin: process.env.ORIGIN,
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
      socket.to(sendUserSocket).emit("msg-recieved", {
        sender: data.from,
        reciever: data.to,
        message: data.message,
      });
    }
  });

  socket.on("typing-msg", (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("typing-msg", {
        sender: data.from,
        reciever: data.to,
      });
    }
  });

  socket.on("typing-stopped", (data) => {
    const sendUserSocket = onlineUsers[data.to];
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("typing-stopped", {
        sender: data.from,
        reciever: data.to,
      });
    }
  });

  socket.on("disconnect", function () {
    Object.keys(onlineUsers).find((userId) => {
      if (onlineUsers[userId] === socket.id) {
        console.log("User Disconnected:", userId);
        delete onlineUsers[userId];
      }
    });
  });
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 😑. Shutting down...");
  console.log(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
